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
    wallThickness: number = 0;
    usableVolume: number = 0;


    constructor(mainBody:IMainBodyShape, base:IBaseShape, minFluidVolume:number,maxFluidVolume:number,  baseAreaTarget:number, wallThickness:number){
        this.mainBodyType = mainBody;
        this.baseType = base;
        this.minFluidVolume = minFluidVolume*0.001;
        this.maxFluidVolume = maxFluidVolume*0.001;
        this.baseArea = baseAreaTarget;
        this.wallThickness = wallThickness*0.001;
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
                lenght = (this.totBodyVolume)/this.baseArea;
                break;
        }
        //console.log(baseVolume, totBodyVolume, radius, this.baseArea);
        return {lenght, baseArea:this.baseArea, baseVolume, totBodyVolume:this.totBodyVolume, targetVolume: this.totBodyVolume+baseVolume};
    }

    getInternalVolume(baseArea:number, lenght:number){
        let mainBodyUsableVolume = 0;
        let baseUsableVolume = 0;
        switch (this.mainBodyType) {
            case IMainBodyShape.RECT:
                let side = Math.sqrt(baseArea);
                let area = Math.pow(side-this.wallThickness, 2);
                mainBodyUsableVolume = area*(lenght-this.wallThickness*2);
                break;
            case IMainBodyShape.CILINDRICAL:
                let radius = Math.sqrt(baseArea/Math.PI);
                let intRadius = (radius-this.wallThickness);
                mainBodyUsableVolume = Math.PI*Math.pow(intRadius, 2)*(lenght-this.wallThickness*2);
                break;
        
            default:
                break;
        }

        if(this.baseType == IBaseShape.SPHERICAL){
            let radius = Math.sqrt(baseArea/Math.PI);
            let intRadius = (-this.wallThickness);
            baseUsableVolume = 4/3*Math.PI*Math.pow(intRadius, 3);
        } else {
            baseUsableVolume = baseArea*this.wallThickness;
        }

        return mainBodyUsableVolume+baseUsableVolume;


    }

    getMass(fluidVolume:number, materialDensity:number){
        const dimensions = this.getTargetDimensions(fluidVolume);
        const internalVolume = this.getInternalVolume(dimensions.baseArea, dimensions.lenght);
        return{ tankWetMass: fluidVolume*this.fluidDensity+ materialDensity*(dimensions.targetVolume - internalVolume)+ this.antiSloshingMass, 
                tankDryMass: materialDensity*(dimensions.targetVolume - internalVolume)+ this.antiSloshingMass
        }
    }
    //generate a number of configurations based on the min and max fluid volume
    generateTanks(numberOfonfigurations:number):Array<ITankDetails>{
        let configurations = new Array<ITankDetails>();

        if(this.minFluidVolume>=this.maxFluidVolume) 
            throw new Error("The minimum fluid volume cannot be greater or egual than the maximum fluid volume");
        
        let step = (this.maxFluidVolume-this.minFluidVolume)/numberOfonfigurations;
        for (let index = 0; index < numberOfonfigurations; index++) {
            let volume = this.minFluidVolume+step*index;
            //if(volume >this.maxFluidVolume) volume = this.maxFluidVolume;
            let dimensions = this.getTargetDimensions(volume);
            let usableVolume = this.getInternalVolume(dimensions.baseArea, dimensions.lenght);
            configurations.push({
                //tank geometry type
                mainBodyType: this.mainBodyType, 
                baseType: this.baseType, 
                //tank geometry dimensions
                baseArea:dimensions.baseArea*Math.pow(10, 4),
                tankLen:dimensions.lenght*100, 
                wallThickness:this.wallThickness*1000,
                //tank volumes
                totVolume:dimensions.targetVolume*1000,
                totBodyVolume:dimensions.totBodyVolume*1000,
                usableVolume:usableVolume*1000,
                baseVolume:dimensions.baseVolume*1000,
                //tank mass
                tankDryMass:this.getMass(volume, this.petDensity).tankDryMass,
                tankWetMass:this.getMass(volume, this.petDensity).tankWetMass,
                //tank fluid mass
                fluidQuantity:volume*this.fluidDensity,
                fluidVoulme:volume*1000,
            });
        }
        return configurations;
    }
}