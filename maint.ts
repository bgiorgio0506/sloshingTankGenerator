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

function main(){
    //ask to the user all the required data
    let numberOfConfigurations = Number(prompt("How many configurations do you want to generate?"));
    let minFluidVolume = Number(prompt("What is the minimum fluid volume?"));
    let maxFluidVolume = Number(prompt("What is the maximum fluid volume?"));
    //give the user the possibility to choose the shape of the tank based on the available options
    let mainBody = Number(prompt("What is the shape of the main body? 1 for rectangular, 2 for cylindrical, 3 for other"));
    let base = Number(prompt("What is the shape of the base? 1 for rectangular, 2 for spherical"));
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