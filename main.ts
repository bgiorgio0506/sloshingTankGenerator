/**
 * The GPL License (GPL)
 * Copyright (c) 2023-2023 Giorgio Bella
 * 
 * This program is free software; you can redistribute it and/or modify it under the terms of the 
 * GNU General Public License as published by the Free Software Foundation; either version 3 of the License, 
 * or (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY;
 * without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. 
 * See the GNU General Public License for more details.
 */

import { json2csv } from "json-2-csv";
import * as fs from "fs";
import * as readline from 'node:readline/promises';
import { ITankDetails } from "./interfaces/ITank";
import { TankGenerator } from "./modules/tankGenerator";

//convert the data to csv format
async function convertToCsv(data:Array<ITankDetails>){
    return await json2csv(data, { expandArrayObjects: true });
}

//write the data to a file
function writeToFile(data:string){
   fs.writeFileSync("data.csv", data, {encoding:"utf8"});
}



async function main(){
    //ask to the user all the required data using the console readline module
    let rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    let mainBody = Number(await rl.question("Insert the main body shape (1 for rectangular, 2 for cylindrical, 3 for other): "));
    let base = Number(await rl.question("Insert the base shape (1 for rectangular, 2 for spherical): "));
    let minFluidVolume = Number(await rl.question("Insert the minimum fluid volume (in liters): "));
    let maxFluidVolume = Number(await rl.question("Insert the maximum fluid volume (in liters): "));
    let numberOfConfigurations = Number(await rl.question("Insert the number of configurations: "));
    //close the readline interface
    rl.close();

    
    
    //create the tank generator
    let tankGenerator = new TankGenerator(mainBody, base, minFluidVolume, maxFluidVolume, 38.4845/100);
    //generate the configurations
    let configurations = tankGenerator.generateTanks(numberOfConfigurations);
    //convert the data to csv format
    convertToCsv(configurations).then((data)=>{
        //write the data to a file
        writeToFile(data);
    });
}

main();