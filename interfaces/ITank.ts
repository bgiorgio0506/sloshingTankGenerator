export interface ITankDetails{
    mainBody: IMainBodyShape, 
    base: IBaseShape, 
    baseArea:number, 
    tankLen:number, 
    volume:number, 
    expectedMass:number,
}

export enum IMainBodyShape {
    RECT = 1, 
    CILINDRICAL = 2, 
    OTHER = 3,
}

export enum IBaseShape{
    RECT = 1, 
    SPHERICAL = 2
}