import { Importer } from '../src/analyze';
import { Parameter } from '../src/lib/famix/model/famix';
import { project, exportProjectSourceFilesForEndtoEndPharoTests } from './testUtils';

const importer = new Importer();
project.createSourceFile("listParameter.ts",
`function testMethod(list: Array<any>): Array<any> {
}
`);

exportProjectSourceFilesForEndtoEndPharoTests(project, __filename);

const fmxRep = importer.famixRepFromProject(project);

describe('Tests for parameters in function', () => {

    it("should contain function 'testMethod'", () => {
        const theFunction = fmxRep._getFamixFunction('{listParameter.ts}.testMethod[FunctionDeclaration]');
        expect(theFunction).toBeTruthy();
    });

    it("should contain parameter 'list'", () => {
        const theParam = Array.from(fmxRep._getAllEntitiesWithType("Parameter") as Set<Parameter>).find(v => v.name === "list");
        expect(theParam).toBeTruthy();
    });

});
