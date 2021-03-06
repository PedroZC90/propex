import { Property, Required, Default } from "@tsed/common";
import { Description } from "@tsed/swagger";
import { Entity, Column, ManyToOne, JoinColumn, PrimaryColumn, Index } from "typeorm";

import { Audit } from "./generics/Audit";
import { Project } from "./Project";
import { ThemeArea } from "./ThemeArea";

@Index("idx_project_theme_areas_project_id", [ "project" ])
@Index("idx_project_theme_areas_theme_area_id", [ "themeArea" ])
@Entity({ name: "project_theme_areas" })
export class ProjectThemeArea extends Audit {

    @PrimaryColumn({ name: "project_id", type: "bigint", unsigned: true, nullable: false })
    public projectId: number;

    @Property({ name: "project" })
    @ManyToOne(() => Project, (project) => project.projectThemeAreas, { nullable: false })
    @JoinColumn({ name: "project_id", referencedColumnName: "id" })
    public project: Project;

    @PrimaryColumn({ name: "theme_area_id", type: "bigint", unsigned: true, nullable: false })
    public themeAreaId: number;

    @Property({ name: "themeArea" })
    @ManyToOne(() => ThemeArea, (themeArea) => themeArea.projectThemeAreas, { nullable: false })
    @JoinColumn({ name: "theme_area_id", referencedColumnName: "id" })
    public themeArea: ThemeArea;

    @Required()
    @Default(false)
    @Description("Marca a área temática principal.")
    @Property({ name: "main" })
    @Column({ name: "main", type: "boolean", default: false, nullable: false })
    public main: boolean = false;

}
