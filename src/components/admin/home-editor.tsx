"use client";

import { useRef } from "react";
import {
  AddButton,
  AreaField,
  EditorPage,
  ImageField,
  ItemTools,
  SelectField,
  Subsection,
  TextField,
  VideoField,
} from "@/components/admin/fields";
import { useAdminContent } from "@/components/admin/content-provider";
import {
  categoryFilterEntries,
  fillCornerFromProject,
  createWorkFilter,
  moveWorkFilter,
  projectCornerImage,
  removeWorkFilter,
  renameWorkFilterAt,
  syncServicesToFilters,
  type AdminImage,
  type CaseItem,
  type CornerProjectImage,
  type HomeCorner,
  type Service,
} from "@/lib/admin-content";
import { isVideoLink } from "@/lib/video";

const cornerLabels = ["Top left", "Top right", "Bottom left", "Bottom right"];

function emptyCorner(): HomeCorner {
  return {
    title: "",
    brand: "",
    tag: "",
    href: "",
    image: null,
    projectId: "",
    projectImage: "",
  };
}

function projectImageOptions(project: CaseItem | undefined) {
  if (!project) return [{ value: "", label: "Pick a project first" }];
  const options: { value: string; label: string }[] = [
    { value: "", label: "Choose image…" },
  ];
  if (project.cover) options.push({ value: "desktop", label: "Desktop cover" });
  if (project.coverMobile) options.push({ value: "mobile", label: "Mobile cover" });
  if (project.marqueeCover) options.push({ value: "marquee", label: "Marquee image" });
  if (options.length === 1) {
    options[0] = { value: "", label: "No project images yet" };
  }
  return options;
}

function ensureCorners(corners: HomeCorner[] | undefined): HomeCorner[] {
  const next = Array.isArray(corners) ? corners.slice(0, 4) : [];
  while (next.length < 4) next.push(emptyCorner());
  return next;
}

function patchVideo(
  current: { poster: AdminImage | null; src: string; label: string } | undefined,
  patch: Partial<{ poster: AdminImage | null; src: string; label: string }>,
) {
  return {
    poster: patch.poster !== undefined ? patch.poster : (current?.poster ?? null),
    src: patch.src !== undefined ? patch.src : (current?.src ?? ""),
    label: patch.label !== undefined ? patch.label : (current?.label ?? "Play"),
  };
}

function serviceForLabel(services: Service[], label: string): Service {
  const key = label.trim().toLowerCase();
  const found = services.find((item) => item.title.trim().toLowerCase() === key);
  return {
    title: found?.title ?? label,
    copy: found?.copy ?? "",
    image: found?.image ?? null,
    corners: ensureCorners(found?.corners),
  };
}

export function HomeEditor() {
  const { content, setPath, mutate } = useAdminContent();
  const home = content.home;
  const categories = categoryFilterEntries(content.work.filters);
  const labelBeforeEdit = useRef("");

  const moveCategory = (filterIndex: number, direction: -1 | 1) => {
    mutate((draft) => {
      moveWorkFilter(draft, filterIndex, direction);
    });
  };

  const removeCategory = (filterIndex: number) => {
    mutate((draft) => {
      removeWorkFilter(draft, filterIndex);
    });
  };

  const addCategory = () => {
    mutate((draft) => {
      createWorkFilter(draft, "New category");
    });
  };

  const patchService = (label: string, patch: Partial<Service>) => {
    mutate((draft) => {
      const key = label.trim().toLowerCase();
      const index = draft.home.services.findIndex(
        (item) => item.title.trim().toLowerCase() === key,
      );
      if (index >= 0) {
        const current = draft.home.services[index];
        draft.home.services[index] = {
          ...current,
          ...patch,
          title: label,
          corners: ensureCorners(patch.corners ?? current.corners),
        };
      } else {
        draft.home.services.push({
          title: label,
          copy: patch.copy ?? "",
          image: patch.image ?? null,
          corners: ensureCorners(patch.corners),
        });
      }
      draft.home.services = syncServicesToFilters(draft.home.services, draft.work.filters);
    });
  };

  const patchCorner = (label: string, cornerIndex: number, corner: HomeCorner) => {
    const service = serviceForLabel(content.home.services, label);
    const corners = ensureCorners(service.corners);
    corners[cornerIndex] = corner;
    patchService(label, { corners });
  };

  const applyProject = (label: string, cornerIndex: number, projectId: string) => {
    if (!projectId) {
      patchCorner(label, cornerIndex, emptyCorner());
      return;
    }
    const project = content.cases.find((entry) => entry.id === projectId);
    if (!project) return;
    patchCorner(label, cornerIndex, fillCornerFromProject(project));
  };

  const applyProjectImage = (
    label: string,
    cornerIndex: number,
    corner: HomeCorner,
    kind: string,
  ) => {
    const project = content.cases.find((entry) => entry.id === corner.projectId);
    if (!project || !kind) {
      patchCorner(label, cornerIndex, { ...corner, projectImage: "", image: corner.image });
      return;
    }
    const imageKind = kind as CornerProjectImage;
    patchCorner(label, cornerIndex, {
      ...corner,
      projectImage: imageKind,
      image: projectCornerImage(project, imageKind),
    });
  };

  const projectOptions = [
    { value: "", label: "Custom (upload or type)" },
    ...content.cases.map((entry) => ({
      value: entry.id,
      label: entry.title.trim() || entry.id,
    })),
  ];

  return (
    <EditorPage>
      <Subsection title="Hero">
        <TextField
          label="Name line"
          required
          max={40}
          value={home.heroName}
          onChange={(value) => setPath("home.heroName", value)}
        />
        <TextField
          label="Highlight"
          required
          max={200}
          format
          help="Select words, then Bold, Italic, or Color. This is the main line on the home page."
          value={home.heroHeadline}
          onChange={(value) => setPath("home.heroHeadline", value)}
        />
        <TextField
          label="Words to highlight in orange"
          required
          help="A shortcut. These words turn orange if they appear in the line above."
          value={home.heroHighlight}
          onChange={(value) => setPath("home.heroHighlight", value)}
        />
        <AreaField
          label="Left column"
          required
          value={home.heroLeft}
          onChange={(value) => setPath("home.heroLeft", value)}
        />
        <AreaField
          label="Right column"
          required
          value={home.heroRight}
          onChange={(value) => setPath("home.heroRight", value)}
        />
        <TextField
          label="Button label"
          required
          max={24}
          value={home.heroCta}
          onChange={(value) => setPath("home.heroCta", value)}
        />
      </Subsection>

      <Subsection
        title="What I believe"
        hint="The cream block halfway down the page."
      >
        <TextField
          label="Small label above"
          required
          max={30}
          value={home.beliefEyebrow}
          onChange={(value) => setPath("home.beliefEyebrow", value)}
        />
        <TextField
          label="Opening line"
          required
          max={70}
          help="Set in bold. One sentence."
          value={home.beliefLead}
          onChange={(value) => setPath("home.beliefLead", value)}
        />
        <AreaField
          label="Body"
          required
          rows={8}
          help="Leave a blank line between paragraphs."
          value={home.beliefBody}
          onChange={(value) => setPath("home.beliefBody", value)}
        />
      </Subsection>

      <Subsection
        title="What I do"
        hint="Same list as Work filters (except All). Add, rename, or remove here and it updates Work filters too. Description and image are for the home cards."
      >
        {categories.map(({ item, index: filterIndex }, position) => {
          const service = serviceForLabel(home.services, item.label);
          return (
            <div
              key={`category-${filterIndex}`}
              className="flex flex-col gap-4 border-b border-[#22262F] pb-6"
            >
              <ItemTools
                title={`Category ${position + 1}`}
                index={position}
                total={categories.length}
                onMove={(direction) => moveCategory(filterIndex, direction)}
                onRemove={() => removeCategory(filterIndex)}
              />
              <TextField
                label="Tab label"
                required
                help="Also a Work filter / project category."
                value={item.label}
                onFocus={() => {
                  labelBeforeEdit.current = item.label;
                }}
                onChange={(value) => {
                  mutate((draft) => {
                    renameWorkFilterAt(
                      draft,
                      filterIndex,
                      value,
                      labelBeforeEdit.current,
                    );
                  });
                }}
              />
              <AreaField
                label="Description"
                required
                rows={3}
                value={service.copy}
                onChange={(value) => patchService(item.label, { copy: value })}
              />
              <ImageField
                label="Card image"
                help="Shown on the middle stack card. 9 MB maximum."
                value={service.image ?? null}
                onChange={(image) => patchService(item.label, { image })}
              />
              <div className="flex flex-col gap-4 rounded-[8px] border border-[#373A41] p-4">
                <p className="font-tanker text-[18px] leading-[1.2] font-normal tracking-normal text-brand-white uppercase">
                  Corner cards for this tab
                </p>
                <p className="font-inter text-[14px] leading-[20px] font-normal text-[#94979C]">
                  Four floating images shown when this category is active.
                </p>
                {service.corners.map((corner, cornerIndex) => {
                  const linked = content.cases.find(
                    (entry) => entry.id === corner.projectId,
                  );
                  return (
                    <div
                      key={`corner-${filterIndex}-${cornerIndex}`}
                      className="flex flex-col gap-3 border-t border-[#22262F] pt-4"
                    >
                      <p className="font-tanker text-[16px] leading-[1.2] font-normal tracking-normal text-brand-white uppercase">
                        {cornerLabels[cornerIndex] || `Corner ${cornerIndex + 1}`}
                      </p>
                      <SelectField
                        label="From project"
                        help="Fills title, brand, tag, link, and image from a case study."
                        value={corner.projectId || ""}
                        onChange={(projectId) =>
                          applyProject(item.label, cornerIndex, projectId)
                        }
                        options={projectOptions}
                      />
                      {corner.projectId ? (
                        <SelectField
                          label="Project image"
                          help="Desktop, mobile, or marquee — only options with an uploaded file show."
                          value={corner.projectImage || ""}
                          onChange={(kind) =>
                            applyProjectImage(item.label, cornerIndex, corner, kind)
                          }
                          options={projectImageOptions(linked)}
                        />
                      ) : null}
                      <ImageField
                        label="Image"
                        help={
                          corner.projectId
                            ? "Filled from the project. You can still replace it with an upload."
                            : "9 MB maximum."
                        }
                        value={corner.image ?? null}
                        onChange={(image) =>
                          patchCorner(item.label, cornerIndex, {
                            ...corner,
                            image,
                            projectImage: "",
                          })
                        }
                      />
                      <TextField
                        label="Title"
                        value={corner.title}
                        onChange={(value) =>
                          patchCorner(item.label, cornerIndex, { ...corner, title: value })
                        }
                      />
                      <TextField
                        label="Brand"
                        value={corner.brand}
                        onChange={(value) =>
                          patchCorner(item.label, cornerIndex, { ...corner, brand: value })
                        }
                      />
                      <TextField
                        label="Tag"
                        value={corner.tag}
                        onChange={(value) =>
                          patchCorner(item.label, cornerIndex, { ...corner, tag: value })
                        }
                      />
                      <TextField
                        label="Link"
                        help="Optional. Example: /selected-work/project-slug"
                        value={corner.href}
                        onChange={(value) =>
                          patchCorner(item.label, cornerIndex, { ...corner, href: value })
                        }
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
        <AddButton onClick={addCategory}>Add category</AddButton>
      </Subsection>

      <Subsection
        title="Video"
        hint="Shows under What I do. Paste a YouTube, Vimeo, or Google Drive link, or upload a file."
      >
        <ImageField
          label="Cover image"
          help="Still shown before play. 9 MB maximum."
          value={home.video?.poster ?? null}
          onChange={(poster) => setPath("home.video", patchVideo(home.video, { poster }))}
        />
        <TextField
          label="Video link"
          help="YouTube, Vimeo, or Google Drive. Leave blank when you upload a file instead."
          value={isVideoLink(home.video?.src ?? "") ? (home.video?.src ?? "") : ""}
          onChange={(src) => setPath("home.video", patchVideo(home.video, { src }))}
        />
        <VideoField
          label="Or upload a video"
          value={isVideoLink(home.video?.src ?? "") ? "" : (home.video?.src ?? "")}
          onChange={(src) => setPath("home.video", patchVideo(home.video, { src }))}
        />
        <TextField
          label="Button label"
          required
          max={16}
          value={home.video?.label ?? "Play"}
          onChange={(label) => setPath("home.video", patchVideo(home.video, { label }))}
        />
      </Subsection>
    </EditorPage>
  );
}
