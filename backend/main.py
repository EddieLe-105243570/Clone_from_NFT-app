from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from web3 import Web3
from dotenv import load_dotenv
import os
import mysql.connector
import json
from datetime import datetime

# ===============================
# 1. Load environment variables
# ===============================
load_dotenv()

network = os.getenv("NETWORK")  # ganache or sepolia

# ===============================
# 2. Initialize FastAPI app
# ===============================
app = FastAPI()

# Allow React frontend to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ===============================
# 3. Connect to database
# ===============================
def get_db_connection():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="",
        database="swin_shop"
    )

# ===============================
# 4. Connect to blockchain network
# ===============================
if network == "sepolia":
    w3 = Web3(Web3.HTTPProvider(os.getenv("INFURA_URL")))
    chain_id = 11155111  # Sepolia
    contract_address = os.getenv("SEPOLIA_CONTRACT_ADDRESS")
else:
    w3 = Web3(Web3.HTTPProvider("http://127.0.0.1:7545"))
    chain_id = 1337  # Ganache
    contract_address = os.getenv("GANACHE_CONTRACT_ADDRESS")

print("Connected to blockchain:", w3.is_connected())
print("Using network:", network)

# ===============================
# 5. Load wallet details
# ===============================
my_address = os.getenv("ACCOUNT_ADDRESS")
private_key = os.getenv("PRIVATE_KEY")

# ===============================
# 6. Load contract ABI and contract
# ===============================
with open("compiled_code.json", "r") as file:
    compiled_sol = json.load(file)

abi = compiled_sol["contracts"]["sampleContract.sol"]["SimpleStorage"]["abi"]
contract = w3.eth.contract(address=contract_address, abi=abi)

# ===============================
# 7. API routes
# ===============================

@app.get("/")
def read_root():
    return {"message": f"Swin Shop Backend running on {network}"}


# ========== USERS ==========

@app.get("/users")
def get_users():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM users")
    users = cursor.fetchall()
    cursor.close()
    conn.close()
    return users


@app.get("/users/{mail}")
def get_user(mail: str):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM users WHERE mail=%s", (mail,))
    user = cursor.fetchone()
    cursor.close()
    conn.close()
    if user:
        return user
    else:
        raise HTTPException(status_code=404, detail="User not found")


@app.post("/users")
def create_user(user: dict):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO users (name, mail, coins, password) VALUES (%s, %s, %s, %s)",
        (user["name"], user["mail"], user["coins"], user["password"])
    )
    conn.commit()
    cursor.close()
    conn.close()
    return {"message": "User created successfully"}

@app.post("/login")
def login(credentials: dict):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM users WHERE id=%s AND password=%s", (credentials["id"], credentials["password"]))
    user = cursor.fetchone()
    cursor.close()
    conn.close()
    if user:
        return {"user": user}
    else:
        raise HTTPException(status_code=401, detail="Invalid credentials")


# ========== MERCHANDISES ==========

@app.get("/merchandises")
def get_merchandises():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM merchandises")
    items = cursor.fetchall()
    cursor.close()
    conn.close()
    return items


# ========== TRANSACTIONS ==========

@app.get("/transactions")
def get_transactions():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM transactions")
    transactions = cursor.fetchall()
    cursor.close()
    conn.close()
    return transactions


@app.get("/transactions/{user_id}")
def get_user_transactions(user_id: int):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("""
        SELECT t.*, m.name as item_name 
        FROM transactions t
        JOIN merchandises m ON t.item_id = m.id
        WHERE t.user_id = %s
    """, (user_id,))
    transactions = cursor.fetchall()
    cursor.close()
    conn.close()
    return transactions



# ========== PURCHASE ==========

@app.post("/purchase")
def purchase(data: dict):
    user_id = data["id"]
    item_id = data["item_id"]
    quantity = data["quantity"]
    total_price = data["total_price"]

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    # Check user balance
    cursor.execute("SELECT coins FROM users WHERE id=%s", (user_id,))
    user = cursor.fetchone()
    if not user or user["coins"] < total_price:
        cursor.close()
        conn.close()
        raise HTTPException(status_code=400, detail="Insufficient balance")

    # Check item stock
    cursor.execute("SELECT remaining FROM merchandises WHERE id=%s", (item_id,))
    item = cursor.fetchone()
    if not item or item["remaining"] < quantity:
        cursor.close()
        conn.close()
        raise HTTPException(status_code=400, detail="Not enough items in stock")

    # Deduct user coins and update item stock
    cursor.execute("UPDATE users SET coins = coins - %s WHERE id=%s", (total_price, user_id))
    cursor.execute("UPDATE merchandises SET remaining = remaining - %s WHERE id=%s", (quantity, item_id))

    # Record transaction
    cursor.execute(
        "INSERT INTO transactions (user_id, item_id, quantity, total_price, date, status) VALUES (%s, %s, %s, %s, %s, %s)",
        (user_id, item_id, quantity, total_price, datetime.now(), "Completed")
    )

    conn.commit()

    # ========== SMART CONTRACT INTERACTION ==========

    try:
        nonce = w3.eth.get_transaction_count(my_address)
        txn = contract.functions.store(total_price).build_transaction({
            "chainId": chain_id,
            "from": my_address,
            "nonce": nonce,
            "gasPrice": w3.to_wei("20", "gwei")
        })

        signed_txn = w3.eth.account.sign_transaction(txn, private_key=private_key)
        tx_hash = w3.eth.send_raw_transaction(signed_txn.raw_transaction)
        tx_receipt = w3.eth.wait_for_transaction_receipt(tx_hash)
        print("✅ Blockchain transaction hash:", tx_hash.hex())

    except Exception as e:
        conn.rollback()
        cursor.close()
        conn.close()
        raise HTTPException(status_code=500, detail=f"Blockchain transaction failed: {e}")

    cursor.close()
    conn.close()
    return {"message": "Purchase successful", "new_balance": user["coins"] - total_price}

# ========== BLOCKCHAIN RETRIEVE (example) ==========

@app.get("/blockchain/value")
def get_blockchain_value():
    try:
        value = contract.functions.retrieve().call()
        return {"stored_value": value}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Blockchain call failed: {e}")