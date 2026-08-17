import { Importer } from '../src/analyze';
import { project, exportProjectSourceFiles } from './testUtils';

const importer = new Importer();

project.createSourceFile("avaScript.js",
`class A {}`);

exportProjectSourceFiles(project, __filename);

const fmxRep = importer.famixRepFromProject(project);

describe('Tests for JavaScript source (not TypeScript)', () => {
    it('should return a fmxRep', () => {
        expect(fmxRep).toBeDefined();
    });
});
