import React from "react";
import "./Kalender.css";

const tables = [

"Bord #001",
"Bord #002",
"Bord #003",
"Bord #004",
"Bord #005",
"Bord #006",
"Bord #007",
];

const times = ["18:00", "18:30", "19:00", "19:30", "20:00"];

const reservations: { [time: string]: string[] } = {
"18:30": ["Bord #001"]
};

export default function Kalender() {
return (
<div className="kalender-page">
<h3 className="kalender-title">Kalender</h3>

<div className="kalender-container">
<div className="kalender-header">
<button className="nav-btn">{"<"}</button>
<button className="kalender-date">28/7</button>
<button className="nav-btn">{">"}</button>
</div>

<table className="kalender-table">
<thead>
<tr>
<th>Tid</th>
{tables.map((table) => (
<th key={table}>{table}</th>
))}
</tr>
</thead>

<tbody>
{times.map((time) => (
<tr key={time}>
<td className="time-cell">{time}</td>
{tables.map((table) => {
const reserved = reservations[time]?.includes(table) ?? false;
return (
<td key={table}>
    {reserved ? (
        <>
        <div className="reserved-text">{table}</div>
        <br />
        <div className="reserved-text2">reservert</div>
    </>
    ) : null}
    </td>
);
})}
</tr>
))}
</tbody>
</table>
</div>
</div>
);
}