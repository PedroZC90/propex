import { Controller, Get, PathParams, Delete, Required, Post, BodyParams, Locals, QueryParams } from "@tsed/common";

import { CustomAuth } from "../../services";
import { TargetRepository, ProjectRepository } from "../../repositories";
import { Target, ResultContent, Page } from "../../entities";
import { IContext, AgeRange } from "../../types";

@Controller("/targets")
export class TargetCtrl {

    constructor(private targetRepository: TargetRepository, private projectRepository: ProjectRepository) {}

    /**
     * Return a list of targets.
     */
    @Get("")
    @CustomAuth({})
    public async fetch(
        @QueryParams("page") page: number = 1,
        @QueryParams("rpp") rpp: number = 15,
        @QueryParams("project") project: number): Promise<Page<Target>> {
        let query = this.targetRepository.createQueryBuilder("t");
        if (project) {
            query = query.innerJoin("t.project", "p", "p.id = :projectId", { projectId: project });
        }
        query = query.skip((page - 1) * rpp).take(rpp);

        return Page.of<Target>(await query.getMany(), page, rpp);
    }

    /**
     * Create/Update a target.
     * @param context                       -- user context.
     * @param target                        -- target data.
     */
    @Post("")
    @CustomAuth({})
    public async save(
        @Locals("context") context: IContext,
        @Required() @BodyParams("target") target: Target
    ): Promise<ResultContent<Target>> {
        // check if user is part of project.
        const project = await this.projectRepository.findByContext(target.project.id, context);

        let t = await this.targetRepository.findOne({ ageRange: target.ageRange, project: { id: project.id } });
        if (t) {
            t = this.targetRepository.merge(t, target);
        } else {
            t = target;
            t.project = project;
        }
        t = await this.targetRepository.save(t);
        
        // return this.targetRepository.save(target);
        return ResultContent.of<Target>(t).withMessage("Target added to project.");
    }

    /**
     * Return a list of targets.
     */
    @Get("/age-ranges")
    @CustomAuth({})
    public async listTypes(): Promise<AgeRange[]> {
        return AgeRange.list;
    }

    /**
     * Search for target information by id.
     * @param id                            -- target id.
     */
    @Get("/:id")
    @CustomAuth({})
    public async get(@Required() @PathParams("id") id: number): Promise<Target | undefined> {
        return this.targetRepository.findById(id);
    }

    /**
     * Delete a target information.
     * @param id                            -- target id.
     */
    @Delete("/:id")
    @CustomAuth({})
    public async delete(@Required() @PathParams("id") id: number): Promise<any> {
        return this.targetRepository.deleteById(id);
    }

}