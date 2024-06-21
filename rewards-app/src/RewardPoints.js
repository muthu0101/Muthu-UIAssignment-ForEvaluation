import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

function RewardPoints() {
  const [transactions, setTransactions] = useState([]);
  const [points, setPoints] = useState({});
  const [totalPoints, setTotalPoints] = useState(0);
  const urlParams = new URLSearchParams(window.location.search);
  let customerID = urlParams.get('customer_id');
  if (!customerID) {
    customerID = 1;
  }

  useEffect(() => {
    fetch(`http://127.0.0.1:5000/api/transactions?customer_id=${customerID}`)
      .then((response) => response.json())
      .then((data) => {
        setTransactions(data);
        calculatePoints(data);
      });
  }, []);

  useEffect(() => {
    calculatePoints(transactions);
  }, [transactions]);

  const calculatePoints = (transactions) => {
    const pointsPerMonth = {};
    let total = 0;
    transactions.forEach((transaction) => {
      const month = new Date(transaction.date).toLocaleString('en-US', { month: 'long', timeZone: 'UTC' });
      const amount = transaction.amount;
      let points = 0;
      if (amount > 100) {
        points = (amount - 100) * 2;
      }
      if (amount >= 50) {
        points += (Math.min(amount, 100) - 50) * 1;
      }
      if (!pointsPerMonth[month]) {
        pointsPerMonth[month] = 0;
      }
      pointsPerMonth[month] += points;
      total += points;
    });
    setPoints(pointsPerMonth);
    setTotalPoints(total);
  };

  return (
    <div className="container">
      <h1>Reward List</h1>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Month</th>
            <th class="text-end">Rewards</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(points).map((month) => (
            <tr key={month}>
              <td>{month}</td>
              <td class="text-end">{points[month]}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td class="fw-bold">Total</td>
            <td class="fw-bold text-end">{totalPoints}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

export default RewardPoints;
