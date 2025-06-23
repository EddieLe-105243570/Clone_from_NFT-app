# main.py
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import mysql.connector
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from datetime import date

app = FastAPI()

# Serve static image files at /images
app.mount("/images", StaticFiles(directory="images"), name="images")

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React frontend origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# Pydantic model
class Transaction(BaseModel):
    student_code: str
    amount: int

class PurchaseInput(BaseModel):
    student_code: str
    item_name: str
    quantity: int
    price: int
    status: str
    
class LoginInput(BaseModel):
    student_code: str
    password: str  # real authentication

class TransactionInput(BaseModel):
    student_code: str
    item_name: str
    quantity: int
    price: int
    status: str

# DB connection setup
def get_db():
    return mysql.connector.connect(
        host="localhost",
        user="root",          # Change if needed
        password="",          # XAMPP default is empty
        database="swinshop"
    )

@app.post("/transactions")
def add_transaction(tx: TransactionInput):
    conn = get_db()
    cursor = conn.cursor()

    # Get current stock
    cursor.execute("SELECT stock_quantity FROM items WHERE name = %s", (tx.item_name,))
    result = cursor.fetchone()
    if not result:
        conn.close()
        raise HTTPException(status_code=404, detail="Item not found")

    current_stock = result[0]
    if current_stock < tx.quantity:
        conn.close()
        raise HTTPException(status_code=400, detail="Not enough stock")

    # Create transaction
    cursor.execute("""
        INSERT INTO transactions (student_code, item_name, quantity, price, status, date)
        VALUES (%s, %s, %s, %s, %s, CURDATE())
    """, (tx.student_code, tx.item_name, tx.quantity, tx.price, tx.status))

    # Update stock
    new_stock = current_stock - tx.quantity
    new_status = 'Out of Stock' if new_stock == 0 else 'Available'

    cursor.execute("""
        UPDATE items SET stock_quantity = %s, stock_status = %s
        WHERE name = %s
    """, (new_stock, new_status, tx.item_name))

    conn.commit()
    conn.close()
    return {"message": "Transaction recorded"}

@app.get("/transactions/{student_code}")
def get_transactions(student_code: str):
    conn = get_db()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM transactions WHERE student_code = %s", (student_code,))
    transactions = cursor.fetchall()
    conn.close()
    return transactions


@app.get("/items")
def get_items():
    conn = get_db()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM items")
    results = cursor.fetchall()
    conn.close()
    return results

@app.get("/wallet/{student_code}")
def get_wallet(student_code: str):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT balance FROM students WHERE student_code = %s", (student_code,))
    result = cursor.fetchone()
    conn.close()
    if result:
        return {"balance": result[0]}
    raise HTTPException(status_code=404, detail="User not found")

@app.post("/wallet/debit")
def debit_wallet(data: Transaction):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT balance FROM students WHERE student_code = %s", (data.student_code,))
    result = cursor.fetchone()
    if not result:
        conn.close()
        raise HTTPException(status_code=404, detail="User not found")

    current_balance = result[0]
    if current_balance < data.amount:
        conn.close()
        raise HTTPException(status_code=400, detail="Insufficient funds")

    new_balance = current_balance - data.amount
    cursor.execute("UPDATE students SET balance = %s WHERE student_code = %s", (new_balance, data.student_code))
    conn.commit()
    conn.close()
    return {"message": "Debit successful", "new_balance": new_balance}

@app.post("/login")
def login_user(data: LoginInput):
    conn = get_db()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM students WHERE student_code = %s", (data.student_code,))
    user = cursor.fetchone()
    conn.close()

    if user:
        return {
            "student_code": user["student_code"],
            "name": user["name"],
            "balance": user["balance"]
        }
    else:
        raise HTTPException(status_code=401, detail="Invalid student code")