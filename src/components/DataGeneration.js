import React, { useState, useEffect } from "react";
import "tailwindcss/tailwind.css";
import _ from "lodash";
import { georgianAlphabet, dutchAlphabet, englishAlphabet } from "./alphabets.js";
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

const countries = {
    Georgia: "საქართველო",
    Netherlands: "Nederland",
    USA: "United States",
};

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

const DataGeneration = () => {
    const [region, setRegion] = useState("Georgia");
    const [errorCount, setErrorCount] = useState(0);
    const [seed, setSeed] = useState("");
    const [records, setRecords] = useState([]);
    const [count, setCount] = useState(20);
    const [pages, setPages] = useState(1);
    const [scroll, setScroll] = useState(0);

    useEffect(() => {
        const handleScroll = (event) => {
            setScroll(window.scrollY);
        };
        if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
            setPages(pages + 1);
        }
        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, [scroll]);

    useEffect(() => {
        generateRandomData(count);
    }, [region, errorCount, seed, pages]);

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

    function getRandomCharacter(type) {
        let randomCharacter;
        type === "personalId" || type === "phoneNumber"
            ? (randomCharacter = faker.string.numeric({ length: 1 }))
            : (randomCharacter = faker.string.fromCharacters(alphabets[region], 1));
        return randomCharacter;
    }

    function addChar(inputString, type) {
        const randomCharacter = getRandomCharacter(type);
        if (typeof inputString !== "undefined" && inputString.length > 0) {
            let randomIndex = faker.number.int(inputString.length);
            let modifiedString =
                inputString.substring(0, randomIndex) +
                randomCharacter +
                inputString.substring(randomIndex);
            return modifiedString;
        } else {
            return randomCharacter;
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

    async function runRandomFunction(inputString, type) {
        const functions = [removeChar, swapChars, addChar];
        const randomLodashNumber = _.random(2);
        const selectedFunction = functions[randomLodashNumber];
        return selectedFunction(inputString, type);
    }

    function measureProbability() {
        const errorProbabilty = Math.ceil(errorCount * 100) % 100;
        let randValue = faker.number.int({ min: 1, max: 100 });
        return randValue <= errorProbabilty;
    }

    const generateError = async (record, type) => {
        const errorCountRounded = _.floor(errorCount);
        if (record) {
            for (let i = 0; i < errorCountRounded; i++) {
                record = await runRandomFunction(record, type);
            }
        }
        if (measureProbability()) {
            record = runRandomFunction(record, type);
        }
        return record;
    };

    const generateRandomData = async (count) => {
        const locale = fakerLocales[region];
        const newRecords = [];
        if (locale) {
            locale.seed(seed);
            for (let p = 0; p < pages; p++) {
                locale.seed(seed + p);
                for (let i = 1; i <= 10; i++) {
                    let firstName = locale.person.firstName();
                    let lastName = locale.person.lastName();
                    let middleName = "";
                    let personalId = generatePersonalId();
                    let country = countries[region];
                    let city = locale.location.city();
                    let streetAddress = locale.location.streetAddress();
                    let phoneNumber = locale.phone.number();

                    if (region === "USA") {
                        middleName = locale.person.middleName();
                        middleName = await generateError(middleName);
                    }

                    firstName = await generateError(firstName);
                    lastName = await generateError(lastName);
                    personalId = await generateError(personalId, "personalId");
                    country = await generateError(country);
                    city = await generateError(city);
                    streetAddress = await generateError(streetAddress, "streetAddress");
                    phoneNumber = await generateError(phoneNumber, "phoneNumber");

                    newRecords.push({
                        index: 10 * p + i,
                        identifier: personalId,
                        name: `${firstName} ${middleName} ${lastName}`,
                        address: `${country}, ${city}, ${streetAddress}`,
                        phone: phoneNumber,
                    });
                }
            }
            setRecords(newRecords);
        }
    };

    const handleInputChange = (e) => {
        e.target.value > 1000 ? setErrorCount(1000) : setErrorCount(e.target.value);
    };

    const inputStyle = "px-2 py-1  border rounded hover:cursor-pointer lg:w-[100px] min-w-16";
    const inputContainerStyle = "flex gap-2 lg:gap-4 items-center";
    const tableStyle = "px-4 py-2 border";

    return (
        <div className="p-8 mt-16 m-auto w-3/5 min-w-fit align-middle items-center   ">
            <h1 className="text-3xl font-bold mb-16 text-center  ">Fake Data Generator</h1>
            <div className="flex flex-row gap-4 mb-4 justify-between items-center content-center m-auto flex-wrap">
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
                        className={` mt-[2px] hover:cursor-pointer`}
                    />
                    <input
                        type="text"
                        id="errorCount"
                        value={errorCount}
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
                        <th className={`${tableStyle}  `}>Index</th>
                        <th className={`${tableStyle}  `}>Identifier</th>
                        <th className={`${tableStyle}  `}>Name</th>
                        <th className={`${tableStyle}  `}>Address</th>
                        <th className={`${tableStyle}  `}>Phone</th>
                    </tr>
                </thead>
                <tbody>
                    {records.map((record) => (
                        <tr key={record.index}>
                            <td className={`${tableStyle} text-center w-1 `}>{record.index}</td>
                            <td className={`${tableStyle}  `}>{record.identifier}</td>
                            <td className={`${tableStyle}  `}>{record.name}</td>
                            <td className={`${tableStyle}  `}>{record.address}</td>
                            <td className={`${tableStyle}  `}>{record.phone}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default DataGeneration;
