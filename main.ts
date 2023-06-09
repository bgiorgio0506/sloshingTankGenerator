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

//const baseArea = 38.4845/100; // this is the equivalent of a 7cm diameter circle or a 6.5cm sqaure

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
    let baseArea = 0;
    
    //Welcome message
    console.log("Welcome to the tank generator\n");
    //Explane the program
    console.log("This program will generate a csv file with the data of multiple tanks configurations based on your input.\nThe program will ask you to insert the main body shape, the base shape, the minimum and maximum fluid volume and the number of configurations that you want generate.\n");
    console.log("Let's start with the main body shape.\n")
    let mainBody = Number(await rl.question("Insert the main body shape (1 for rectangular, 2 for cylindrical): "));
    let base = Number(await rl.question("Choose the base shape:\n 1 for plane(2D GENERIC)\n 2 for plane circular(2D)\n 3 for plane square (2D)\n 4 for spherical(3D)\n "));
    //ask the user the base area or calculate it based on the base shape
    switch (base) {
        case 1:
            baseArea= Number(await rl.question("Insert the base area (in square meters): "));
            break;
        case 2:
            let radius = Number(await rl.question("Insert the radius (in cm): "));
            baseArea = Math.PI*Math.pow(radius/100, 2);
           
            break;
        case 3:
            let side = Number(await rl.question("Insert the side (in cm): "));
            baseArea = Math.pow(side/100, 2);
            break;
        case 4:
            let radius3d = Number(await rl.question("Insert the radius (in cm): "));
            baseArea = Math.PI*Math.pow(radius3d/100, 2);
    
        default:
            break;
    }

    let wallThickness = Number(await rl.question("Insert the wall thickness (in mm): "));
    console.log("Now insert the minimum and maximum fluid volume.\n");
    let minFluidVolume = Number(await rl.question("Insert the minimum fluid volume (in liters): "));
    let maxFluidVolume = Number(await rl.question("Insert the maximum fluid volume (in liters): "));
    console.log("Nearly done!! Now insert the number of configurations that you want to generate.\n");
    let numberOfConfigurations = Number(await rl.question("Insert the number of configurations: "));
    //close the readline interface
    rl.close();


    
    
    //create the tank generator
    let tankGenerator = new TankGenerator(mainBody, base, minFluidVolume, maxFluidVolume, baseArea, wallThickness);
    //generate the configurations
    let configurations = tankGenerator.generateTanks(numberOfConfigurations);
    //convert the data to csv format
    convertToCsv(configurations).then((data)=>{
        //write the data to a file
        writeToFile(data);
    });
}

main();