from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from datetime import date
from web3 import Web3
import json
import mysql.connector

app = FastAPI()

# Allow React frontend to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database connection
def get_db_connection():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="",
        database="swin_shop"
    )

@app.get("/")
def read_root():
    return {"message": "Swin Shop Backend is running"}

# Connect to Ganache
w3 = Web3(Web3.HTTPProvider("http://127.0.0.1:7545"))

# Check connection
print("Connected to Ganache:", w3.is_connected())

# Load ABI from compiled_code.json
with open("./compiled_code.json", "r") as file:
    compiled_sol = json.load(file)

abi = compiled_sol["contracts"]["sampleContract.sol"]["SimpleStorage"]["abi"]

# Your deployed contract address
contract_address = "0x2dAb1a15C9Fd4cE7bEc51Ee70ab4134015E48F70"

# Load contract
contract = w3.eth.contract(address=contract_address, abi=abi)

# Your Ganache account details
my_address = "0x0711179bD08B2A39756456059661E2745FB1d042"
private_key = "0x8b61443a44a09def2df352dff90115b1622d75ac9e05e7341d1ab29dff99b0b4"
chain_id = 1337

# Get all users
@app.get("/users")
def get_users():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM users")
    users = cursor.fetchall()
    cursor.close()
    conn.close()
    return users

# Get user by email
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

# Create new user
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

# Update user's coins
@app.put("/users/{mail}/coins")
def update_coins(mail: str, coins: int):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("UPDATE users SET coins = %s WHERE mail = %s", (coins, mail))
    conn.commit()
    cursor.close()
    conn.close()
    return {"message": "Coins updated"}

# Delete user
@app.delete("/users/{mail}")
def delete_user(mail: str):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM users WHERE mail=%s", (mail,))
    conn.commit()
    cursor.close()
    conn.close()
    return {"message": "User deleted"}

# Login endpoint
@app.post("/login")
def login(data: dict):
    student_id = data["id"]
    password = data["password"]
    
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM users WHERE id=%s", (student_id,))
    user = cursor.fetchone()
    cursor.close()
    conn.close()
    
    if user:
        if user["password"] == password:
            return {"message": "Login successful", "user": user}
        else:
            raise HTTPException(status_code=401, detail="Invalid password")
    else:
        raise HTTPException(status_code=404, detail="User not found")
    
@app.get("/merchandises")
def get_merchandises():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    # Update stock status based on remaining before fetching
    cursor.execute("""
        UPDATE merchandises
        SET stock = CASE
            WHEN remaining >= 1 THEN 'Available'
            ELSE 'Out of Stock'
        END
    """)
    conn.commit()

    cursor.execute("SELECT * FROM merchandises")
    merchandises = cursor.fetchall()
    cursor.close()
    conn.close()
    return merchandises

@app.get("/transactions/{user_id}")
def get_transactions(user_id: int):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("""
        SELECT t.id, m.name AS item_name, t.quantity, t.total_price, t.date, t.status
        FROM transactions t
        JOIN merchandises m ON t.item_id = m.id
        WHERE t.user_id = %s
        ORDER BY t.date DESC
    """, (user_id,))
    transactions = cursor.fetchall()
    cursor.close()
    conn.close()
    return transactions

# Purchase endpoint
@app.post("/purchase")
def purchase(data: dict):
    student_id = data["id"]
    total_price = data["total_price"]
    item_id = data["item_id"]
    quantity = data.get("quantity", 1)  # default to 1
    
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    
    # Fetch user coins
    cursor.execute("SELECT coins FROM users WHERE id=%s", (student_id,))
    user = cursor.fetchone()
    if not user:
        cursor.close()
        conn.close()
        raise HTTPException(status_code=404, detail="User not found")
    
    current_coins = user["coins"]
    if current_coins < total_price:
        cursor.close()
        conn.close()
        raise HTTPException(status_code=400, detail="Insufficient balance")
    
    # Fetch merchandise stock
    cursor.execute("SELECT remaining FROM merchandises WHERE id=%s", (item_id,))
    item = cursor.fetchone()
    if not item:
        cursor.close()
        conn.close()
        raise HTTPException(status_code=404, detail="Item not found")
    
    current_remaining = item["remaining"]
    if current_remaining < quantity:
        cursor.close()
        conn.close()
        raise HTTPException(status_code=400, detail="Not enough items in stock")
    
    # Deduct user coins
    new_balance = current_coins - total_price
    cursor.execute("UPDATE users SET coins=%s WHERE id=%s", (new_balance, student_id))
    
    # Deduct merchandise stock and update status
    new_remaining = current_remaining - quantity
    new_stock_status = 'Available' if new_remaining >= 1 else 'Out of Stock'
    cursor.execute("UPDATE merchandises SET remaining=%s, stock=%s WHERE id=%s",
                   (new_remaining, new_stock_status, item_id))
    
    # Insert transaction record
    today = date.today()
    cursor.execute("""
        INSERT INTO transactions (user_id, item_id, quantity, total_price, date, status)
        VALUES (%s, %s, %s, %s, %s, %s)
    """, (student_id, item_id, quantity, total_price, today, 'Completed'))
    
    conn.commit()
    cursor.close()
    conn.close()
    
    # Build transaction to call smart contract function
    nonce = w3.eth.get_transaction_count(my_address)

    txn = contract.functions.store(123).build_transaction({
        "chainId": chain_id,
        "from": my_address,
        "nonce": nonce,
        "gasPrice": w3.eth.gas_price,
    })

    # Sign transaction
    signed_txn = w3.eth.account.sign_transaction(txn, private_key=private_key)

    # Send transaction
    tx_hash = w3.eth.send_raw_transaction(signed_txn.raw_transaction)

    # Wait for confirmation
    w3.eth.wait_for_transaction_receipt(tx_hash)

    print("✅ Purchase recorded on blockchain with tx hash:", tx_hash.hex())

    
    return {"message": "Purchase successful", "new_balance": new_balance}