import { Controller, Get, PathParams, Delete, Required, Post, BodyParams, Locals, QueryParams } from "@tsed/common";
import { NotImplemented } from "@tsed/exceptions";

import { Authenticated } from "../../core/services";
import { ProjectRepository, StudentRepository } from "../../repositories";
import { Student, ResultContent, Page } from "../../entities";
import { Context } from "../../core/models";

@Controller("/students")
export class StudentCtrl {

    constructor(
        private studentRepository: StudentRepository,
        private projectRepository: ProjectRepository) {
        // initialize your stuffs here
    }

    /**
     * Return a paginates list of students.
     * @param page                          -- page number.
     * @param rpp                           -- rows per page.
     * @param q                             -- query string.
     * @param projectId                     -- project id.
     */
    @Get("")
    @Authenticated({})
    public async fetch(
        @QueryParams("page") page: number = 1,
        @QueryParams("rpp") rpp: number = 15,
        @QueryParams("q") q?: string,
        @QueryParams("project") projectId?: number
    ): Promise<Page<Student>> {
        const students = await this.studentRepository.fetch({ page, rpp, q, projectId });
        return Page.of<Student>(students, page, rpp);
    }

    /**
     * Create/Update a student.
     * @param context                       -- user context.
     * @param student                       -- student data.
     */
    @Post("")
    @Authenticated({})
    public async save(
        @Locals("context") context: Context,
        @Required() @BodyParams("student") student: Student
    ): Promise<ResultContent<Student>> {
        throw new NotImplemented("Method Not Implemented.");
    }

    /**
     * Search for student information by id.
     * @param id                            -- student id.
     */
    @Get("/:id")
    @Authenticated({})
    public async get(@Required() @PathParams("id") id: number): Promise<Student | undefined> {
        return this.studentRepository.findById(id);
    }

    /**
     * Delete a student information.
     * @param id                            -- student id.
     */
    @Delete("/:id")
    @Authenticated({})
    public async delete(@Required() @PathParams("id") id: number): Promise<any> {
        return this.studentRepository.deleteById(id);
    }

}
