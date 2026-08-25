import { Importer } from '../src/analyze';
import { Concretization, ParameterConcretization, ParametricClass } from '../src/lib/famix/model/famix';
import { project, exportProjectSourceFiles } from './testUtils';

const importer = new Importer();

project.createSourceFile("concretizationClassSpecialization.ts",
`class ClassA<T> {
}

class ClassB extends ClassA<string> {
}

class ClassC extends ClassA<string> {
}

class ClassD<U> extends ClassA<U> {
}

class ClassE<T> {
}

class ClassF extends ClassE<string> {
}
`);

exportProjectSourceFiles(project, __filename);

const fmxRep = importer.famixRepFromProject(project);

describe('Tests for concretization', () => {

    it("should parse generics", () => {
        expect(fmxRep).toBeTruthy();
    });

    it("should contain 6 generic classes", () => {
        expect(fmxRep._getAllEntitiesWithType("ParametricClass").size).toBe(6);
    });

    it("should contain generic classes named ClassA", () => {
        const listOfNames = Array.from(fmxRep._getAllEntitiesWithType("ParametricClass")).map(e => (e as ParametricClass).name);
        expect(listOfNames).toContain("ClassA");

        const numberOfClassA = listOfNames.filter(name => name === "ClassA").length;
        expect(numberOfClassA).toBe(3); 
    });

    const theClass = fmxRep._getFamixClass("{concretizationClassSpecialization.ts}.ClassA<T>[ClassDeclaration]");

    it ("should not be an abstract class", () => {
        expect(theClass).toBeTruthy();
        if (theClass) expect(theClass.isAbstract).toBe(false);
    });

    it("should contain 3 concretizations", () => {
        expect(fmxRep._getAllEntitiesWithType("Concretization").size).toBe(3);
    });

    it("The generic Class should be ClassA<T> with genericParameter T", () => {
        const theConcretizations = fmxRep._getAllEntitiesWithType("Concretization") as Set<Concretization>;
        const iterator = theConcretizations.values();
        const firstElement = iterator.next().value as Concretization;
        expect(firstElement.genericEntity).toBe(theClass);
        const T = firstElement.genericEntity.genericParameters.values().next().value as ParametricClass;
        expect(T.name).toBe("T");
    });

    it.skip("should contain two parameter concretization", () => {
        expect(fmxRep._getAllEntitiesWithType("ParameterConcretization").size).toBe(2);
    });

    it.skip("The first parameter concretization should contain two concretizations", () => {
        const theConcretizations = fmxRep._getAllEntitiesWithType("ParameterConcretization") as Set<ParameterConcretization>;
        const iterator = theConcretizations.values();
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
