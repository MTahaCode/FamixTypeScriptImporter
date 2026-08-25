import { Importer } from '../src/analyze';
import { Concretization, ParametricFunction, ParametricMethod } from '../src/lib/famix/model/famix';
import { project, exportProjectSourceFiles } from './testUtils';

const importer = new Importer();

project.createSourceFile("src/concretizationFunctionInstantiation.ts",
`
interface CustomType {
    message: string;
}

function createInstance<T>(c: string): T {
    return c as unknown as T;
}

const instance = createInstance<CustomType>("hello");

class Processor {
    process<V>(value: V): V {
        return value;
    }
}

const processor = new Processor();

const resultString = processor.process<string>("Hello, world!");
`);

exportProjectSourceFiles(project, __filename);

const fmxRep = importer.famixRepFromProject(project);

describe('Tests for concretization', () => {

    it("should parse generics", () => {
        expect(fmxRep).toBeTruthy();
    });

    it("should contain two generic functions", () => {
        expect(fmxRep._getAllEntitiesWithType("ParametricFunction").size).toBe(2);
    });

    it("should contain generic functions named createInstance", () => {
        const listOfNames = Array.from(fmxRep._getAllEntitiesWithType("ParametricFunction")).map(e => (e as ParametricFunction).name);
        expect(listOfNames).toContain("createInstance");

        const numberOfCreateInstance = listOfNames.filter(name => name === "createInstance").length;
        expect(numberOfCreateInstance).toBe(2); 
    });

    it("should contain two generic methods", () => {
        expect(fmxRep._getAllEntitiesWithType("ParametricMethod").size).toBe(2);
    });

    it("should contain generic methods named process", () => {
        const listOfNames = Array.from(fmxRep._getAllEntitiesWithType("ParametricMethod")).map(e => (e as ParametricMethod).name);
        expect(listOfNames).toContain("process");

        const numberOfCreateInstance = listOfNames.filter(name => name === "process").length;
        expect(numberOfCreateInstance).toBe(2); 
    });

    it("should contain two concretizations", () => {
        expect(fmxRep._getAllEntitiesWithType("Concretization").size).toBe(2);
    });

    const theInterface = fmxRep._getFamixInterface("{src/concretizationFunctionInstantiation.ts}.CustomType[InterfaceDeclaration]");

    it.skip("The concrete Function should be createInstance with concreteParameter CustomType", () => {
        const theConcretizations = fmxRep._getAllEntitiesWithType("Concretization") as Set<Concretization>;
        const iterator = theConcretizations.values();
        const firstElement = iterator.next().value as Concretization;
        expect(firstElement).toBeTruthy();
        const secondElement = iterator.next().value as Concretization;
        expect(secondElement.concreteEntity.name).toBe("createInstance");
        const concParameter = secondElement.concreteEntity.concreteParameters.values().next().value as ParametricFunction;
        expect(concParameter).toBeTruthy();
        expect(concParameter.name).toBe(theInterface?.name);
    });

    it.skip("The concrete Method should be process with concreteParameter string", () => {
        const theConcretizations = fmxRep._getAllEntitiesWithType("Concretization") as Set<Concretization>;
        const iterator = theConcretizations.values();
        const firstElement = iterator.next().value as Concretization;
        expect(firstElement).toBeTruthy();
        expect(firstElement.concreteEntity.name).toBe("process");
        const concParameter = firstElement.concreteEntity.concreteParameters.values().next().value as ParametricMethod;
        expect(concParameter).toBeTruthy();
        expect(concParameter.name).toBe("string");
    });

    it.skip("should contain two parameter concretizations", () => {
        expect(fmxRep._getAllEntitiesWithType("ParameterConcretization").size).toBe(2);
    });
});
