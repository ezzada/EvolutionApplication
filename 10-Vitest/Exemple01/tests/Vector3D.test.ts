import {describe, it, expect, beforeEach} from "vitest"
import {Vector3D, Sphere} from "../src/index.ts"

// Le nom du describe doit correspondre au nom de la classe qui teste
describe("Vector3D", ()=> {
    // Le nom de it doit correspondre à la fonctionnalité à tester
    it("doit initialisercorrectement les coordonnées X,Y,Z,",()=> {

        const v = new Vector3D(1,2,3);

        expect(v.X).toBe(1); // toBe pour une égalité stricte de valeur et de type
        expect(v.Y).toBe(2);
        expect(v.Z).toEqual(3); // toEqual pour une égalité profonde d'objets (fonctionnement aussi pour les types primitifs)
 
    }) 
})

describe("Sphere", () =>{

    // 1. Déclaration de variable dans la portér de describe pour y avoir accès dans les "it"
    let v: Vector3D;
    let f: Sphere;

    // 2. Initialiser ces variables avant chaque test 
    beforeEach(()=>{
        v = new Vector3D(1,2,3);
        f = new Sphere(v,5);
    })



    it("doit initialiser correctement l'emplacement", () =>{
        
        v.X = 10;
        expect(f.Emplacement.X).toBe(10);

    })
})
