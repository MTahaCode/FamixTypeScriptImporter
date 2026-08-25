import { Importer } from '../src/analyze';
import { ParametricInterface } from '../src/lib/famix/model/famix';
import { project, exportProjectSourceFiles } from './testUtils';

const importer = new Importer();

project.createSourceFile("concretizationInterfaceClass.ts",
`
interface InterfaceD<T> {
}

class ClassG implements InterfaceD<number> {
}
`);

exportProjectSourceFiles(project, __filename);

const fmxRep = importer.famixRepFromProject(project);

describe('Tests for concretization', () => {

    it("should parse generics", () => {
        expect(fmxRep).toBeTruthy();
    });

    it("should contain 2 generic interfaces", () => {
        expect(fmxRep._getAllEntitiesWithType("ParametricInterface").size).toBe(2);
    });

    it("should contain generic interfaces named InterfaceD", () => {
        const listOfNames = Array.from(fmxRep._getAllEntitiesWithType("ParametricInterface")).map(e => (e as ParametricInterface).name);
        expect(listOfNames).toContain("InterfaceD");

        const numberOfInterfaceD = listOfNames.filter(name => name === "InterfaceD").length;
        expect(numberOfInterfaceD).toBe(2); 
    });

    it("should contain one concretization", () => {
        expect(fmxRep._getAllEntitiesWithType("Concretization").size).toBe(1);
    });
    
    it.skip("should contain one parameter concretization", () => {
        expect(fmxRep._getAllEntitiesWithType("ParameterConcretization").size).toBe(1);
    });

});
