import { Importer } from '../src/analyze';
import { Concretization, ParameterConcretization, ParametricInterface } from '../src/lib/famix/model/famix';
import { project, exportProjectSourceFiles } from './testUtils';

const importer = new Importer();

project.createSourceFile("concretizationInterfaceSpecialization.ts",
`
interface InterfaceA<T> {
}

interface InterfaceB extends InterfaceA<string> {
}

interface InterfaceF extends InterfaceA<string> {
}

interface InterfaceD<U> extends InterfaceA<U> {
}

interface InterfaceE<T> {
}

interface InterfaceH extends InterfaceE<string> {
}

interface InterfaceH extends InterfaceE<number> , InterfaceA<number> {
}
`);

exportProjectSourceFiles(project, __filename);

const fmxRep = importer.famixRepFromProject(project);

describe('Tests for concretization', () => {

    it("should parse generics", () => {
        expect(fmxRep).toBeTruthy();
    });

    it("should contain 8 generic interfaces", () => {
        expect(fmxRep._getAllEntitiesWithType("ParametricInterface").size).toBe(8);
    });

    it("should contain generic interfaces named InterfaceA", () => {
        const listOfNames = Array.from(fmxRep._getAllEntitiesWithType("ParametricInterface")).map(e => (e as ParametricInterface).name);
        expect(listOfNames).toContain("InterfaceA");
        const numberOfInterfaceA = listOfNames.filter(name => name === "InterfaceA").length;
        expect(numberOfInterfaceA).toBe(4); 
    });

    it("should contain generic interfaces named InterfaceE", () => {
        const listOfNames = Array.from(fmxRep._getAllEntitiesWithType("ParametricInterface")).map(e => (e as ParametricInterface).name);
        expect(listOfNames).toContain("InterfaceE");
        const numberOfInterfaceE = listOfNames.filter(name => name === "InterfaceE").length;
        expect(numberOfInterfaceE).toBe(3); 
    });

    const theInterface = fmxRep._getFamixInterface("{concretizationInterfaceSpecialization.ts}.InterfaceA<T>[InterfaceDeclaration]");

    it("should contain 3 concretizations", () => {
        expect(fmxRep._getAllEntitiesWithType("Concretization").size).toBe(5);
    });

    it("The generic Class should be InterfaceA<T> with genericParameter T", () => {
        const theConcretizations = fmxRep._getAllEntitiesWithType("Concretization") as Set<Concretization>;
        const iterator = theConcretizations.values();
        const firstElement = iterator.next().value as Concretization;
        expect(firstElement.genericEntity).toBe(theInterface);
        const T = firstElement.genericEntity.genericParameters.values().next().value as ParametricInterface;
        expect(T).toBeTruthy();
        expect(T.name).toBe("T");
    });

    it.skip("The concrete Class should be InterfaceA<string> with concreteParameter string", () => {
        const theConcretizations = fmxRep._getAllEntitiesWithType("Concretization") as Set<Concretization>;
        const iterator = theConcretizations.values();
        const firstElement = iterator.next().value as Concretization;
        expect(firstElement.concreteEntity.name).toBe("InterfaceA");
        const concParameter = firstElement.concreteEntity.concreteParameters.values().next().value as ParametricInterface;
        expect(concParameter).toBeTruthy();
        expect(concParameter.name).toBe("string");
    });

    it.skip("should contain two parameter concretization", () => {
        expect(fmxRep._getAllEntitiesWithType("ParameterConcretization").size).toBe(3);
    });

    it.skip("The first parameter concretization should contain two concretizations", () => {
        const theConcretization = fmxRep._getAllEntitiesWithType("ParameterConcretization") as Set<ParameterConcretization>;
        const iterator = theConcretization.values();
        const firstElement = iterator.next().value as ParameterConcretization;
        expect(firstElement).toBeTruthy();
        const genericParameter = firstElement.genericParameter;
        expect(genericParameter).toBeTruthy();
        const concParameter = firstElement.concreteParameter;
        expect(concParameter).toBeTruthy();

        expect(genericParameter.name).toBe("T");
        expect(concParameter.name).toBe("string");
        expect(firstElement.concretizations.size).toBe(2);
    });

});
