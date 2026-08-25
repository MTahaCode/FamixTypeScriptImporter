import { Importer } from '../src/analyze';
import { Concretization, ParametricInterface } from '../src/lib/famix/model/famix';
import { project, exportProjectSourceFiles } from './testUtils';

const importer = new Importer();

project.createSourceFile("concretizationTypeInstantiation.ts",
`
interface InterfaceE<T> {
    (param: T): void;
}

const interfaceInstance: InterfaceE<number> = { value: "example" };

class MyClass<T> {
}

function processInstance(instance: MyClass<boolean>): MyClass<boolean> {
    return instance;
}
`);

exportProjectSourceFiles(project, __filename);

const fmxRep = importer.famixRepFromProject(project);

describe('Tests for concretization', () => {

    it("should parse generics", () => {
        expect(fmxRep).toBeTruthy();
    });

    it("should contain 3 generic interfaces", () => {
        expect(fmxRep._getAllEntitiesWithType("ParametricInterface").size).toBe(2);
    });

    it("should contain 2 generic classes", () => {
        expect(fmxRep._getAllEntitiesWithType("ParametricClass").size).toBe(2);
    });

    it("should contain generic interfaces named InterfaceE", () => {
        const listOfNames = Array.from(fmxRep._getAllEntitiesWithType("ParametricInterface")).map(e => (e as ParametricInterface).name);
        expect(listOfNames).toContain("InterfaceE");
        const numberOfInterfaceE = listOfNames.filter(name => name === "InterfaceE").length;
        expect(numberOfInterfaceE).toBe(2); 
    });

    it("should contain 3 concretizations", () => {
        expect(fmxRep._getAllEntitiesWithType("Concretization").size).toBe(2);
    });

    it.skip("should contain two parameter concretization", () => {
        expect(fmxRep._getAllEntitiesWithType("ParameterConcretization").size).toBe(2);
    });


    it.skip("The concrete Class should be MyClass with concreteParameter boolean", () => {
        const theConcretizations = fmxRep._getAllEntitiesWithType("Concretization") as Set<Concretization>;
        const iterator = theConcretizations.values();
        const firstElement = iterator.next().value as Concretization;
        expect(firstElement.concreteEntity.name).toBe("MyClass");
        const concParameter = firstElement.concreteEntity.concreteParameters.values().next().value as ParametricInterface;
        expect(concParameter).toBeTruthy();
        expect(concParameter.name).toBe("boolean");
    });

    it.skip("The concrete Interface should be InterfaceE with concreteParameter number", () => {
        const theConcretizations = fmxRep._getAllEntitiesWithType("Concretization") as Set<Concretization>;
        const iterator = theConcretizations.values();
        const secondElement = iterator.next().value as Concretization;
        expect(secondElement).toBeTruthy();
        expect(secondElement.concreteEntity.name).toBe("InterfaceE");
        const concParameter = secondElement.concreteEntity.concreteParameters.values().next().value as ParametricInterface;
        expect(concParameter).toBeTruthy();
        expect(concParameter.name).toBe("number");
    });

});
