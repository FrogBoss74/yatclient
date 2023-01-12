import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';



// Array.prototype.IsIn = function(s) {
//   return this.every(v => s.has(v));
// };

// Array.prototype.Sum = function() {
//   return this.reduce((c, v) => c + v);
// };
// Array.prototype.RowToInd = function() {
//   return [...this.slice(0, BONUS), ...this.slice(BONUS + 1, this.length - 1)];
// };
// Array.prototype.IndToRow = function(fill = 0) {
//   return [...this.slice(0, BONUS), fill, ...this.slice(BONUS), fill];
// };
// Array.prototype.Bonus = function() {
//   return this.slice(0, BONUS).Sum() > 62 ? 35 : 0;
// };
// Array.prototype.Count = function(val) {
//   return this.filter(v => v == val).length;
// };
// Array.prototype.Unique = function() {
//   return [...new Set(this)];
// };
// Array.prototype.Diff = function() {
//   return this.map((c, i, a) => this[i + 1] - this[i]);
// };

// Array.prototype.IsStraight4 = function() {
//   return (
//     [1, 2, 3, 4].IsIn(new Set(this)) ||
//     [2, 3, 4, 5].IsIn(new Set(this)) ||
//     [3, 4, 5, 6].IsIn(new Set(this))
//   );
// };

// Array.prototype.IsStraight5 = function() {
//   return (
//     [1, 2, 3, 4, 5].IsIn(new Set(this)) || [2, 3, 4, 5, 6].IsIn(new Set(this))
//   );
// };

// Array.prototype.AreValsIdentical = function() {
//   return this.Unique().length == 1;
// };

// Array.prototype.Decomp2 = function(l) {
//   return this.reduce((c, v, i, a) => {
//     if (i <= a.length - l)
//       c.push([a.slice(i, l + i), a.slice(0, i).concat(a.slice(l + i))]);
//     return c;
//   }, []);
// };

// Array.prototype.IsFull = function() {
//   const arr = this.sort().Decomp2(3);
//   return arr.reduce(
//     (c, v) => c || (v[0].AreValsIdentical() && v[1].AreValsIdentical()),
//     false
//   );
// };

// Array.prototype.ReorderArr = function() {
//   return this.map(v =>
//     v[0].length > v[1].length ? [v[0], v[1]] : [v[1], v[0]]
//   );
// };

// Array.prototype.NOfKind = function(n) {
//   const arr = this.sort()
//     .Decomp2(n)
//     .ReorderArr();
//   return arr.reduce(
//     (c, v) => (c + v[0].AreValsIdentical() ? [...v[0], ...v[1]].Sum() : 0),
//     0
//   );
// };

// Array.prototype.Score = function() {
//   const arr = this.slice();

//   if (arr.Unique() == 0) return Array(15).fill("");
//   else
//     return [
//       arr.Count(1),
//       arr.Count(2) * 2,
//       arr.Count(3) * 3,
//       arr.Count(4) * 4,
//       arr.Count(5) * 5,
//       arr.Count(6) * 6,
//       arr.NOfKind(3),
//       arr.NOfKind(4),
//       arr.IsFull() ? 25 : 0,
//       arr.IsStraight4() ? 25 : 0,
//       arr.IsStraight5() ? 35 : 0,
//       arr.AreValsIdentical(5) ? 50 : 0,
//       arr.Sum()
//     ];
// };

// Array.prototype.Preview = function() {
//   return [...this.slice(0, BONUS), "", ...this.slice(BONUS), ""];
// };

// Array.prototype.Roll = function(holdArr = [false], diceMax = 6) {
//   const ha = [...holdArr];

//   return this.map((v, i) =>
//     ha[i % ha.length] ? v : Math.floor(Math.random() * diceMax + 1)
//   );
// };
console.log('started');

ReactDOM.render(
    <App />,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
