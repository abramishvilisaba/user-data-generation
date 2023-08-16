import React, { useState, useEffect } from "react";
import "tailwindcss/tailwind.css";
import { faker } from "@faker-js/faker";

const regions = [
    { label: "Poland", value: "Poland" },
    { label: "USA", value: "USA" },
    { label: "Georgia", value: "Georgia" },
];
const inputStyle = "px-2 py-1 border rounded"; // Common input styles

const App = () => {
    const [region, setRegion] = useState("Poland");
    const [errorCount, setErrorCount] = useState(0);
    const [seed, setSeed] = useState("");
    const [records, setRecords] = useState([]);
    console.log(errorCount);

    const generateRandomData = () => {
        const newRecords = [];
        for (let i = 1; i <= 20; i++) {
            newRecords.push({
                index: i,
                identifier: faker.number.int(),
                name: faker.person.fullName(),
                address: faker.location.streetAddress(),
                phone: faker.phone.number(),
            });
        }
        setRecords(newRecords);
    };

    useEffect(() => {
        generateRandomData();
    }, [region, errorCount, seed]);

    return (
        <div className="p-8 m-auto w-1/2 align-middle items-center">
            <h1 className="text-3xl font-bold mb-16 text-center">
                Random Records Generator
            </h1>
            <div className="flex-col w-8/12 mb-4 justify-between items-center m-auto">
                <div className="flex mb-4 justify-between items-center">
                    <label htmlFor="region" className="mr-2">
                        Select Region:
                    </label>
                    <select
                        id="region"
                        value={region}
                        onChange={(e) => setRegion(e.target.value)}
                        className={`${inputStyle} w-1/2`}
                    >
                        {regions.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="flex mb-4 justify-between items-center">
                    <label htmlFor="errorCount" className="mr-2">
                        Error per Record:
                    </label>
                    <input
                        type="range"
                        id="errorCount"
                        min={0}
                        max={1}
                        step={0.1}
                        value={errorCount}
                        onChange={(e) => setErrorCount(Number(e.target.value))}
                        // className={`${inputStyle} w-1/2`}
                        className={` w-1/2`}
                    />
                </div>
                <div className="flex mb-4 justify-between items-center">
                    <div className="flex mb-4  items-center justify-between">
                        <label htmlFor="seed" className="mr-2">
                            Seed Value:
                        </label>
                        <input
                            type="text"
                            id="seed"
                            value={seed}
                            onChange={(e) => setSeed(e.target.value)}
                            className={`${inputStyle} w-1/2 `}
                        />
                    </div>
                    <button
                        onClick={() => {
                            setSeed(Math.random().toString());
                            generateRandomData();
                        }}
                        className="flex px-4 py-2 mb-2 bg-blue-500 text-white rounded justify-start"
                    >
                        Random
                    </button>
                </div>
            </div>
            <table className="w-full border-collapse border">
                <thead>
                    <tr>
                        <th className="px-4 py-2 border">Index</th>
                        <th className="px-4 py-2 border">Identifier</th>
                        <th className="px-4 py-2 border">Name</th>
                        <th className="px-4 py-2 border">Address</th>
                        <th className="px-4 py-2 border">Phone</th>
                    </tr>
                </thead>
                <tbody>
                    {records.map((record) => (
                        <tr key={record.index}>
                            <td className="px-4 py-2 border">{record.index}</td>
                            <td className="px-4 py-2 border">
                                {record.identifier}
                            </td>
                            <td className="px-4 py-2 border">{record.name}</td>
                            <td className="px-4 py-2 border">
                                {record.address}
                            </td>
                            <td className="px-4 py-2 border">{record.phone}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default App;
