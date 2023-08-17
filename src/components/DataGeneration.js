import React, { useState, useEffect } from "react";
import "tailwindcss/tailwind.css";
import _ from "lodash";
import {
    georgianAlphabet,
    dutchAlphabet,
    englishAlphabet,
} from "./alphabets.js";

import {
    faker,
    fakerKA_GE as fakerGE,
    fakerNL as fakerNL,
    fakerEN_US as fakerUS,
} from "@faker-js/faker";

const regions = [
    { label: "Georgia", value: "Georgia" },
    { label: "Netherlands", value: "Netherlands" },
    { label: "USA", value: "USA" },
];

const App = () => {
    const [region, setRegion] = useState("Georgia");
    const [errorCount, setErrorCount] = useState(0);
    const [seed, setSeed] = useState("");
    const [records, setRecords] = useState([]);

    // const customFaker = new Faker({
    //     locale: [de_CH, de, en, base],
    // });

    const fakerLocales = {
        Georgia: fakerGE,
        Netherlands: fakerNL,
        USA: fakerUS,
    };
    const alphabets = {
        Georgia: georgianAlphabet,
        Netherlands: dutchAlphabet,
        USA: englishAlphabet,
    };

    //

    //

    function addChar(inputString) {
        if (typeof inputString !== "undefined" && inputString.length > 0) {
            let randomIndex = faker.number.int(inputString.length);
            const randomCharacter = faker.string.fromCharacters(
                alphabets[region],
                1
            );
            let modifiedString =
                inputString.substring(0, randomIndex) +
                randomCharacter +
                inputString.substring(randomIndex);
            return modifiedString;
        } else {
            return faker.string.fromCharacters(georgianAlphabet, 1);
        }
    }

    function swapChars(inputString) {
        if (typeof inputString !== "undefined" && inputString.length > 1) {
            let randomIndex = faker.number.int(inputString.length - 2);
            const charArr = inputString.split("");
            const temp = charArr[randomIndex];
            charArr[randomIndex] = charArr[randomIndex + 1];
            charArr[randomIndex + 1] = temp;
            return charArr.join("");
        } else {
            return "";
        }
    }

    function removeChar(inputString) {
        if (typeof inputString !== "undefined" && inputString.length > 0) {
            let randomIndex = faker.number.int(inputString.length - 1);
            const charArr = inputString.split("");
            charArr.splice(randomIndex, 1);
            return charArr.join("");
        } else {
            return "";
        }
    }

    async function runRandomFunction(inputString) {
        const functions = [removeChar, swapChars, addChar];
        const randomLodashNumber = _.random(2);
        const selectedFunction = functions[randomLodashNumber];
        return selectedFunction(inputString);
    }

    function measureProbabilty() {
        const errorProbabilty = Math.ceil(errorCount * 100) % 100;
        let randValue = faker.number.int({ min: 1, max: 100 });
        return randValue <= errorProbabilty;
    }

    const generateError = async (record) => {
        const originalString = record;
        const errorCountRounded = _.floor(errorCount);
        if (record) {
            for (let i = 0; i < errorCountRounded; i++) {
                console.log(record);
                record = await runRandomFunction(record);
            }
        }

        measureProbabilty() ? (record = runRandomFunction(record)) : null;

        console.log(originalString);
        console.log(record);
        return record;
    };

    function generatePersonalId() {
        let personalId;

        switch (region) {
            case "Netherlands":
                personalId = faker.string.numeric({ length: 9 });
                break;
            case "USA":
                personalId =
                    faker.string.numeric({ length: 3 }) +
                    "-" +
                    faker.string.numeric({ length: 2 }) +
                    "-" +
                    faker.string.numeric({ length: 4 });
                break;
            case "Georgia":
                personalId = faker.string.octal({ length: 9, prefix: "01" });
                break;
            default:
                personalId = "";
                break;
        }

        return personalId;
    }

    const generateRandomData = async () => {
        const locale = fakerLocales[region];
        const newRecords = [];

        if (locale) {
            locale.seed(seed);
            //
            // let record = locale.person.firstName();
            // console.log(record);
            // record ? (record = await generateError(record, locale)) : null;
            // console.log(record);

            for (let i = 1; i <= 20; i++) {
                let firstName = locale.person.firstName();
                firstName = await generateError(firstName);
                let lastName = locale.person.lastName();
                lastName = await generateError(lastName);
                let middleName =
                    region === "USA" ? locale.person.middleName() : "";
                region === "USA"
                    ? (middleName = await generateError(middleName))
                    : "";
                let personalId = generatePersonalId();
                personalId = await generateError(personalId, "personalId");
                let streetAddress = locale.location.streetAddress();
                streetAddress = await generateError(
                    streetAddress,
                    "streetAddress"
                );
                let phoneNumber = locale.phone.number();
                phoneNumber = await generateError(phoneNumber, "phoneNumber");

                newRecords.push({
                    index: i,
                    identifier: personalId,
                    name: `${firstName} ${middleName} ${lastName}`,
                    address: streetAddress,
                    phone: phoneNumber,
                });
            }
            setRecords(newRecords);
        }
    };

    const handleInputChange = (e) => {
        e.target.value > 1000
            ? setErrorCount(1000)
            : setErrorCount(e.target.value);
    };

    useEffect(() => {
        generateRandomData();
    }, [region, errorCount, seed]);

    const inputStyle = "px-2 py-1 border rounded hover:cursor-pointer";
    const inputContainerStyle = "flex gap-4 items-center";

    return (
        <div className="p-8 m-auto w-3/5 min-w-fit align-middle items-center">
            <h1 className="text-3xl font-bold mb-16 text-center ">
                Random Records Generator
            </h1>
            <div className="flex flex-row  mb-4 justify-between items-center content-center m-auto">
                <div className={`${inputContainerStyle}  `}>
                    <label htmlFor="region" className="">
                        Select Region:
                    </label>
                    <select
                        id="region"
                        value={region}
                        onChange={(e) => setRegion(e.target.value)}
                        className={`${inputStyle} w-32 text-left `}
                    >
                        {regions.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>
                <div className={`${inputContainerStyle}  `}>
                    <label htmlFor="errorCount" className="">
                        Error per Record:
                    </label>
                    <input
                        type="range"
                        id="errorCount"
                        min={0}
                        max={10}
                        step={1}
                        value={errorCount}
                        onChange={(e) => setErrorCount(e.target.value)}
                        // className={`${inputStyle} w-1/2`}
                        className={` mt-[2px] hover:cursor-pointer`}
                    />
                    <input
                        type="text"
                        id="errorCount"
                        value={errorCount > 0 ? errorCount : ""}
                        max={1000}
                        onChange={handleInputChange}
                        className={`${inputStyle} w-20 `}
                    />
                </div>
                <div className={`${inputContainerStyle}  `}>
                    <label htmlFor="seed" className="">
                        Seed Value:
                    </label>
                    <input
                        type="text"
                        id="seed"
                        value={seed}
                        onChange={(e) => setSeed(Number(e.target.value))}
                        className={`${inputStyle} w-20 `}
                    />

                    <button
                        onClick={() => {
                            setSeed(faker.number.int(1000));
                            generateRandomData();
                        }}
                        className="flex px-4 py-2  bg-blue-500 text-white rounded justify-start"
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
