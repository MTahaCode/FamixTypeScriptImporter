import { Importer } from '../src/analyze';
import { Concretization, ParametricClass } from '../src/lib/famix/model/famix';
import { project, exportProjectSourceFilesForEndtoEndPharoTests } from './testUtils';

const importer = new Importer();

project.createSourceFile("concretizationGenericInstantiation.ts",
`
class ClassA<T> {
    property: T;
    
    constructor(value: T) {
        this.property = value;
    }
}

const instance = new ClassA<number>(42);
`);

exportProjectSourceFilesForEndtoEndPharoTests(project, __filename);

const fmxRep = importer.famixRepFromProject(project);

describe('Tests for concretization', () => {

    it("should parse generics", () => {
        expect(fmxRep).toBeTruthy();
    });

    it("should contain 1 generic class", () => {
        expect(fmxRep._getAllEntitiesWithType("ParametricClass").size).toBe(2);
    });

    it("should contain generic classes named ClassA", () => {
        const listOfNames = Array.from(fmxRep._getAllEntitiesWithType("ParametricClass")).map(e => (e as ParametricClass).name);
        expect(listOfNames).toContain("ClassA");

        const numberOfClassA = listOfNames.filter(name => name === "ClassA").length;
        expect(numberOfClassA).toBe(2); 
    });

    const theClass = fmxRep._getFamixClass("{concretizationGenericInstantiation.ts}.ClassA<T>[ClassDeclaration]");

    it ("should not be an abstract class", () => {
        expect(theClass).toBeTruthy();
        if (theClass) expect(theClass.isAbstract).toBe(false);
    });

    it("should contain one concretization", () => {
        expect(fmxRep._getAllEntitiesWithType("Concretization").size).toBe(1);
    });

    it("The generic Class should be ClassA<T> with genericParameter T", () => {
        const theConcretizations = fmxRep._getAllEntitiesWithType("Concretization") as Set<Concretization>;
        const iterator = theConcretizations.values();
        const firstElement = iterator.next().value as Concretization;
        expect(firstElement.genericEntity).toBe(theClass);
        const T = firstElement.genericEntity.genericParameters.values().next().value as ParametricClass;
        expect(T.name).toBe("T");
    });

    it.skip("The concrete Class should be ClassA<string> with concreteParameter string", () => {
        const theConcretization = fmxRep._getAllEntitiesWithType("Concretization") as Set<Concretization>;
        const iterator = theConcretization.values();
        const firstElement = iterator.next().value as Concretization;
        expect(firstElement.concreteEntity.name).toBe("ClassA");
        const concParameter = firstElement.concreteEntity.concreteParameters.values().next().value as ParametricClass;
        expect(concParameter).toBeTruthy();
        expect(concParameter.name).toBe("number");
    });

    it.skip("should contain one parameter concretization", () => {
        expect(fmxRep._getAllEntitiesWithType("ParameterConcretization").size).toBe(1);
    });
    
});
