from flask import Flask, jsonify, request
from datetime import datetime, timedelta

app = Flask(__name__)

# Example data (replace with a database or data storage)
data = [
    {"id": 1, "customer_id": 1, "date": "2024-05-01", "amount": 120},
    {"id": 2, "customer_id": 1, "date": "2024-05-15", "amount": 80},
    {"id": 3, "customer_id": 2, "date": "2024-05-01", "amount": 120},
    {"id": 4, "customer_id": 1, "date": "2024-06-10", "amount": 110},
    {"id": 5, "customer_id": 2, "date": "2024-06-19", "amount": 60},
    {"id": 6, "customer_id": 1, "date": "2024-06-01", "amount": 200},
    {"id": 7, "customer_id": 2, "date": "2024-06-20", "amount": 120},
]

@app.route("/api/transactions", methods=["GET"])
def get_transactions():
    customer_id = request.args.get("customer_id")
    three_months_ago = datetime.now() - timedelta(days=90)
    transactions = [tx for tx in data 
                     if tx["customer_id"] == int(customer_id) 
                     and datetime.strptime(tx["date"], "%Y-%m-%d") >= three_months_ago]
    return jsonify(transactions)

if __name__ == "__main__":
    app.run(debug=True)