import { IndexedFileAnchor } from "../src/lib/famix/model/famix/indexed_file_anchor";
import { Comment } from "../src/lib/famix/model/famix/comment";
import { Project } from "ts-morph";
import fs from "fs";
import path from "path";

export const project = new Project(
    {
        compilerOptions: {
            baseUrl: ""
        },
        useInMemoryFileSystem: true,
    }
);

export const FamixPrefix = "Famix-TypeScript-Entities";

export function inspectProjectSourceFiles(project: Project) {
    const sourceFiles = project.getSourceFiles();

    for (const sourceFile of sourceFiles) {
        const sourceFilePath = sourceFile.getFilePath();
        const sourceFileText = sourceFile.getFullText();

        console.log(`Source file: ${sourceFilePath}`);
        console.log(`Source file text: ${sourceFileText}`);
    }
}

/**
 * Exports the source files of a project to a specified directory.
 * @param project - The project whose source files are to be exported.
 * @param testFilePath - The path to the test file.
 */
export function exportProjectSourceFilesForEndtoEndPharoTests(project: Project, testFilePath: string) {
    const sourceFiles = project.getSourceFiles();

    const testName = path.basename(testFilePath, ".test.ts");

    const outputRoot = path.resolve(
        ".github/ImporterSampleProject/src", testName
    );

    const projectRoot = process.cwd();

    for (const sourceFile of sourceFiles) {
        const sourceFilePath = sourceFile.getFilePath();
        const sourceFileText = sourceFile.getFullText();

        const relativePath = path.relative(
            projectRoot,
            sourceFilePath.replace(/^[/\\]/, "")
        );
        const outputPath = path.join(outputRoot, relativePath);

        fs.mkdirSync(path.dirname(outputPath), { recursive: true });
        fs.writeFileSync(outputPath, sourceFileText, "utf8");

        console.log(`Created: ${outputPath}`);
    }
}

function getIndexedFileAnchorFromComment(comment: Comment) {
    return comment?.sourceAnchor as IndexedFileAnchor;
}

function getCommentFromAnchor(anchor: IndexedFileAnchor, project: Project) {
    return project.getSourceFileOrThrow(anchor.fileName).getFullText().substring(anchor.startPos - 1, anchor.endPos);
}

export function getCommentTextFromCommentViaAnchor(comment: Comment, project: Project) {
    return getCommentFromAnchor(getIndexedFileAnchorFromComment(comment), project);
}

export function getTextFromAnchor(anchor: IndexedFileAnchor, project: Project) {
    return project.getSourceFileOrThrow(anchor.fileName).getFullText().substring(anchor.startPos - 1, anchor.endPos);
}
