"use strict";
import fs from "fs";

const fsPromises = fs.promises;


export async function getData() {
    return await fsPromises.readFile("./data/user.json", "utf-8", (err,data) => {
        if (err){
            console.error(err.message)
        }
        return (data);
    });
}