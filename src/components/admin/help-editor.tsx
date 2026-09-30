import { EditorPage, Subsection } from "@/components/admin/fields";

const body = "font-inter text-[16px] leading-[24px] font-normal text-brand-white";
const item = "font-inter text-[16px] leading-[24px] font-normal text-[#94979C]";

export function HelpEditor() {
  return (
    <EditorPage>
      <Subsection title="What this is">
        <p className={body}>
          A working prototype of your admin. Everything you type here is real and
          stays saved between visits, so you can decide what fields you actually
          need before anyone writes production code.
        </p>
      </Subsection>

      <Subsection title="What it does not do yet">
        <ol className="flex flex-col gap-4">
          <li className={item}>
            <span className="font-medium text-brand-white">No login.</span> Anyone
            with the link could edit. Real admins need accounts and passwords
            handled properly.
          </li>
          <li className={item}>
            <span className="font-medium text-brand-white">Uploads work here, but only for you.</span>{" "}
            Images are shrunk and saved in this browser, so they will not follow
            you to another computer and they are not on the internet yet. A real
            setup stores them on a service that serves them worldwide.
          </li>
          <li className={item}>
            <span className="font-medium text-brand-white">Not connected to the live site.</span>{" "}
            Editing here does not change your public pages yet.
          </li>
        </ol>
      </Subsection>

      <Subsection title="Three ways to make it real">
        <ol className="flex flex-col gap-4">
          <li className={item}>
            <span className="font-medium text-brand-white">Hosted CMS.</span> Sanity,
            Storyblok or Payload. You define these same fields, they give you
            login, uploads and hosting. Days of setup, small monthly fee.
            Recommended.
          </li>
          <li className={item}>
            <span className="font-medium text-brand-white">Site builder.</span> Webflow
            or Framer with a CMS collection for case studies. Fastest to launch,
            least custom.
          </li>
          <li className={item}>
            <span className="font-medium text-brand-white">Custom build.</span> This
            panel plus a database, login and file storage. Full control, and by far
            the most expensive to build and maintain.
          </li>
        </ol>
      </Subsection>

      <Subsection title="Why the fields matter more than the code">
        <p className={body}>
          Whichever route you pick, someone has to decide what a case study is
          made of. That decision is the expensive part, and you have just made it
          by using this.
        </p>
      </Subsection>
    </EditorPage>
  );
}
