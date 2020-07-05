import { Controller, Get, QueryParams, PathParams, MergeParams, UseBeforeEach, Locals } from "@tsed/common";

import { ProjectValidationMiddleware } from "../../middlewares";
import { Authenticated } from "../../core/services";
import { AttachmentRepository, ProjectRepository } from "../../repositories";
import { Page, Attachment } from "../../entities";
import { Context } from "../../core/models";

@UseBeforeEach(ProjectValidationMiddleware)
@Controller("/:projectId/attachments")
@MergeParams(true)
export class ProjectAttachmentCtrl {

    constructor(
        private attachmentRepository: AttachmentRepository,
        private projectRepository: ProjectRepository) {
        // initialize your stuffs here
    }

    /**
     * Return a list of attachments tied to a project.
     * @param projectId                     -- project id.
     * @param page                          -- page number.
     * @param rpp                           -- row per page.
     * @param q                             -- query string.
     */
    @Get("")
    @Authenticated({})
    public async get(@Locals("context") context: Context,
        @PathParams("projectId") projectId: number,
        @QueryParams("page") page: number = 1,
        @QueryParams("rpp") rpp: number = 15,
        @QueryParams("q") q?: string
    ): Promise<Page<Attachment>> {
        const project = await this.projectRepository.findByContext(projectId, context);

        const attachments = await this.attachmentRepository.fetch({ page, rpp, q, projectId: project.id });
        return Page.of(attachments, page, rpp);
    }

}
