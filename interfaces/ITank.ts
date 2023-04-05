export interface ITankDetails{
    mainBodyType: IMainBodyShape, 
    baseType: IBaseShape, 
    baseArea:number, 
    tankLen:number, 
    baseVolume:number,
    totVolume:number, 
    fluidQuantity:number,
    fluidVoulme:number,
    tankDryMass:number,
    tankWetMass:number,
}

export enum IMainBodyShape {
    RECT = 1, 
    CILINDRICAL = 2, 
    OTHER = 3,
}

export enum IBaseShape{
    PLANE = 1,
    PLANE_CIRCULAR = 2,
    PLANE_RECTANGULAR = 3, 
    SPHERICAL = 4
}