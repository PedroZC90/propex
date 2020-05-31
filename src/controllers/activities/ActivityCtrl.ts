import { Controller, Get, PathParams, Delete, Required, Locals, QueryParams, Post, BodyParams } from "@tsed/common";

import { CustomAuth } from "../../services";
import { ActivityRepository } from "../../repositories";
import { Activity } from "../../entities";
import { IContext } from "../../types";

@Controller("/activities")
export class ActivityCtrl {

    constructor(private activityRepository: ActivityRepository) {}

    /**
     * Return a list of Activitys.
     * @param context                       -- user context.
     * @param project                       -- project id or title.
     */
    @Get("/")
    @CustomAuth({})
    public async fetch(
        @Locals("context") context: IContext,
        @QueryParams("project") project: number | string
    ): Promise<Activity[]> {
        let query = this.activityRepository.createQueryBuilder("activity")
            .innerJoin("activity.project", "project");

        // project = JSON.parse(project as string);
        if (typeof project === "string") {
            query = query.where("project.title LIKE :title", { title: `%${project}%` });
        } else if (typeof project === "number") {
            query = query.where("project.id = :id", { id: project });
        }

        return query.getMany();
    }

    /**
     * Save/Update a Activity.
     * @param context                       -- user context.
     * @param Activitys                   -- Activity data.
     */
    @Post("/")
    @CustomAuth({})
    public async save(
        @Locals("context") context: IContext,
        @Required() @BodyParams("Activity") Activitys: Activity
    ): Promise<Activity> {
        return this.activityRepository.save(Activitys);
    }

    /**
     * Search a Activity by id.
     * @param id                            -- Activity id.
     */
    @Get("/:id")
    public async get(@PathParams("id") id: number): Promise<Activity | undefined> {
        return this.activityRepository.findById(id);
    }

    /**
     * Delete a Activity.
     * @param id                            -- evalutaion id.
     */
    @Delete("/:id")
    public async delete(@PathParams("id") id: number): Promise<any> {
        return this.activityRepository.deleteById(id);
    }

}
