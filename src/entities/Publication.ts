import { Property, Required, Enum, PropertyDeserialize } from "@tsed/common";
import { Entity, Column, ManyToOne, JoinColumn, PrimaryGeneratedColumn, Index } from "typeorm";

import { Audit } from "./generics/Audit";
import { Project } from "./Project";
import { Attachment } from "./Attachment";
import { PublicationType } from "../core/types";
import { PublicationTypeEnumTransformer } from "../core/utils";
import { Description } from "@tsed/swagger";

@Index("idx_publications_project_id", [ "project" ])
@Index("idx_publications_attachment_id", [ "attachment" ])
@Entity({ name: "publications" })
export class Publication extends Audit {

    @Property({ name: "id" })
    @PrimaryGeneratedColumn({ name: "id", type: "bigint", unsigned: true })
    public id: number;
    
    // @PropertySerialize((v) => AgeRangeEnumTransformer.to(v))
    @PropertyDeserialize((v) => PublicationTypeEnumTransformer.from(v.key || v))
    @Required()
    @Enum(PublicationType)
    @Property({ name: "type" })
    @Column({ name: "type", type: "varchar", length: 255, transformer: PublicationTypeEnumTransformer, nullable: false })
    public type: PublicationType;

    @Description("Título da publicação")
    @Required()
    @Property({ name: "title" })
    @Column({ name: "title", type: "varchar", length: 255, nullable: false })
    public title: string;

    @Description("Nome do jornal onde foi publicado")
    @Required()
    @Property({ name: "journal" })
    @Column({ name: "journal", type: "varchar", length: 255, nullable: false })
    public journal: string;

    @Description("Link para publicação")
    @Required()
    @Property({ name: "link" })
    @Column({ name: "link", type: "varchar", length: 255, nullable: false })
    public link: string;

    @Property({ name: "project" })
    @ManyToOne(() => Project, (project) => project.publications, { nullable: false })
    @JoinColumn({ name: "project_id", referencedColumnName: "id" })
    public project: Project;

    @Property({ name: "attachment" })
    @ManyToOne(() => Attachment, (attachment) => attachment.publications, { nullable: true })
    @JoinColumn({ name: "attachment_id", referencedColumnName: "id" })
    public attachment: Attachment;

}
