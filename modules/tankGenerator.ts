import { ITankDetails, IMainBodyShape, IBaseShape } from "../interfaces/ITank";

export class TankGenerator implements ITankDetails{
    volume: number = 0; 
    expectedMass: number = 0;
    baseArea: number = 0; 
    tankLen: number = 0;
    mainBody: IMainBodyShape;
    base: IBaseShape;
    fluidDensity: number = 997; // kg/m3 maybe change it to salt water density value 1025 kg/m3
    petDensity: number = 1380; // kg/m3
    minFluidVolume: number = 0;
    maxFluidVolume: number = 0;
    targetVolume: number = 0;
    antiSloshingMass: number = 0.1; // kg this is the maximum mass of the anti sloshing system

    constructor(mainBody:IMainBodyShape, base:IBaseShape, minFluidVolume:number,maxFluidVolume:number,  baseAreaTarget:number){
        this.mainBody = mainBody;
        this.base = base;
        this.minFluidVolume = minFluidVolume*0.001;
        this.maxFluidVolume = maxFluidVolume*0.001;
        this.baseArea = baseAreaTarget;
    }

    //generate configuration for a single tank based on the fluid volume
    getTargetDimensions(fluidVolume:number){
        let lenght = 0;
        let baseVolume = 0;
        let radius = Math.sqrt(this.baseArea/Math.PI);
        let totVolume= fluidVolume*2; // required volume is twice the max fluid volume
        switch (this.base) {
            case IBaseShape.SPHERICAL:
                    baseVolume = 4/3*Math.PI*Math.pow(radius, 3);
                break;
            default:
                //the base is 2d so the volume is 0
                baseVolume = 0;
                break;
        }

        lenght = (totVolume-baseVolume)/this.baseArea;
        return {lenght, baseArea:this.baseArea, baseVolume, volume:totVolume, };

    }

    getMass(fluidVolume:number, materialDensity:number){
        return fluidVolume*this.fluidDensity+ materialDensity*this.getTargetDimensions(fluidVolume).volume+ this.antiSloshingMass;
    }

    //generate a number of configurations based on the min and max fluid volume
    generateTanks(numberOfonfigurations:number):Array<ITankDetails>{
        let configurations = new Array<ITankDetails>();
        let step = (this.maxFluidVolume-this.minFluidVolume)/numberOfonfigurations;
        for (let index = 0; index < numberOfonfigurations; index++) {
            let volume = this.minFluidVolume+step*index;
            let dimensions = this.getTargetDimensions(volume);
            configurations.push({
                mainBody: this.mainBody, 
                base: this.base, 
                baseArea:dimensions.baseArea, 
                tankLen:dimensions.lenght, 
                volume:dimensions.volume, 
                expectedMass:this.getMass(volume, this.petDensity),
            });
        }
        return configurations;
    }
}