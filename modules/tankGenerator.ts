import { ITankDetails, IMainBodyShape, IBaseShape } from "../interfaces/ITank";

export class TankGenerator implements ITankDetails{
    totVolume: number = 0; 
    baseVolume: number = 0;
    baseArea: number = 0; 
    tankLen: number = 0;
    mainBodyType: IMainBodyShape;
    baseType: IBaseShape;
    fluidDensity: number = 997; // kg/m3 maybe change it to salt water density value 1025 kg/m3
    petDensity: number = 1380; // kg/m3
    minFluidVolume: number = 0;
    maxFluidVolume: number = 0;
    targetVolume: number = 0;
    antiSloshingMass: number = 0.1; // kg this is the maximum mass of the anti sloshing system
    fluidQuantity: number = 0;
    fluidVoulme: number = 0;
    tankDryMass: number = 0;
    tankWetMass: number = 0;
    totBodyVolume: number = 0;


    constructor(mainBody:IMainBodyShape, base:IBaseShape, minFluidVolume:number,maxFluidVolume:number,  baseAreaTarget:number){
        this.mainBodyType = mainBody;
        this.baseType = base;
        this.minFluidVolume = minFluidVolume*0.001;
        this.maxFluidVolume = maxFluidVolume*0.001;
        this.baseArea = baseAreaTarget;
    }

    //generate configuration for a single tank based on the fluid volume
    getTargetDimensions(fluidVolume:number){
        let lenght = 0;
        let baseVolume = 0;
        let radius = Math.sqrt(this.baseArea/Math.PI);
        this.totBodyVolume= fluidVolume*2; // required volume is twice the max fluid volume

        switch (this.baseType) {
            case IBaseShape.SPHERICAL:
                    baseVolume = 4/3*Math.PI*Math.pow(radius, 3);
                    lenght = (this.totBodyVolume)/this.baseArea+ 2*radius;
                break;
            default:
                //the base is 2d so the volume is 0
                baseVolume = 0;
                lenght = (this.totBodyVolume)/this.baseArea;
                break;
        }
        //console.log(baseVolume, totBodyVolume, radius, this.baseArea);
        return {lenght, baseArea:this.baseArea, baseVolume, totBodyVolume:this.totBodyVolume, targetVolume: this.totBodyVolume+baseVolume};
    }

    getMass(fluidVolume:number, materialDensity:number){
        return{ tankWetMass: fluidVolume*this.fluidDensity+ materialDensity*this.getTargetDimensions(fluidVolume).targetVolume+ this.antiSloshingMass, 
                tankDryMass: materialDensity*this.getTargetDimensions(fluidVolume).targetVolume+ this.antiSloshingMass};
    }

    //generate a number of configurations based on the min and max fluid volume
    generateTanks(numberOfonfigurations:number):Array<ITankDetails>{
        let configurations = new Array<ITankDetails>();

        if(this.minFluidVolume>=this.maxFluidVolume) 
            throw new Error("The minimum fluid volume cannot be greater or egual than the maximum fluid volume");
        
        let step = (this.maxFluidVolume-this.minFluidVolume)/numberOfonfigurations;
        for (let index = 0; index < numberOfonfigurations; index++) {
            let volume = this.minFluidVolume+step*index;
            let dimensions = this.getTargetDimensions(volume);
            configurations.push({
                //tank geometry type
                mainBodyType: this.mainBodyType, 
                baseType: this.baseType, 
                //tank geometry dimensions
                baseArea:dimensions.baseArea*Math.pow(10, 6),
                tankLen:dimensions.lenght*100, 
                //tank volumes
                totVolume:dimensions.targetVolume*100,
                totBodyVolume:dimensions.totBodyVolume*100,
                baseVolume:dimensions.baseVolume*100,
                //tank mass
                tankDryMass:this.getMass(volume, this.petDensity).tankDryMass,
                tankWetMass:this.getMass(volume, this.petDensity).tankWetMass,
                //tank fluid mass
                fluidQuantity:volume*this.fluidDensity*100,
                fluidVoulme:volume*100,
            });
        }
        return configurations;
    }
}