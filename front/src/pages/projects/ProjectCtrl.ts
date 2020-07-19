import { Vue, Component } from "vue-property-decorator";

import { projectService } from "../../core/services";

import { Project } from "../../core/types";
import { requiredInput } from "../../core/utils";

@Component({ name: "ProjectPage" })
export default class ProjectPage extends Vue {
    
    public id: number | undefined;
    public project: Project = {};

    public requiredInput = requiredInput;

    public async load(): Promise<void> {
        if (this.id) {
            this.project = await projectService.get(this.id);
        }
    }

    public async reset(): Promise<void> {
        // do nothing
    }

    public async submit(): Promise<void> {
        // do nothing
    }

    public async mounted() {
        await this.load();
    }

}
