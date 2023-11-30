import { type ActionFunctionArgs, type MetaFunction } from "@remix-run/node";
import { useFetcher } from "@remix-run/react";
import { PrismaClient } from "@prisma/client";
import { format } from "date-fns";
import { useEffect, useRef } from "react";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export async function action({ request }: ActionFunctionArgs) {
  const db = new PrismaClient();
  let formData = await request.formData();

  let { date, category, text } = Object.fromEntries(formData);
  if (
    typeof date !== "string" ||
    typeof text !== "string" ||
    typeof category !== "string"
  ) {
    throw new Error("Bad request");
  }

  return db.entry.create({
    data: {
      type: category,
      date: new Date(date),
      text: text,
    },
  });
}

export default function Index() {
  let fetcher = useFetcher();
  let textareadRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (fetcher.state === "idle" && textareadRef.current) {
      // clear + focus
      textareadRef.current.value = "";
      textareadRef.current.focus();
    }
  }, [fetcher.state]);

  return (
    <div className="p-10">
      <h1 className="text-5xl">Word Journal</h1>
      <p className="mt-2 text-lg text-gray-400">
        Learning and doings. Updated Weekly.
      </p>

      <div className="my-8 border p-3">
        <p className="italic">Create an entry</p>
        <fetcher.Form method="post" className="mt-2">
          <fieldset
            className="disabled:opacity-80"
            disabled={fetcher.state === "submitting"}
          >
            <div className="">
              <div className="mt-4">
                <input
                  type="date"
                  name="date"
                  className="text-gray-700"
                  required
                  defaultValue={format(new Date(), "yyyy-MM-dd")}
                />
              </div>
              <div className="mt-4 space-x-6">
                <label>
                  <input
                    required
                    className="mr-1"
                    type="radio"
                    defaultChecked
                    name="category"
                    value={"work"}
                  />
                  Work
                </label>
                <label>
                  <input
                    className="mr-1"
                    type="radio"
                    name="category"
                    value={"learning"}
                  />
                  Learning
                </label>
                <label>
                  <input
                    className="mr-1"
                    type="radio"
                    name="category"
                    value={"interesting-thing"}
                  />
                  Interesting thing
                </label>
              </div>

              <div className="mt-2">
                <textarea
                  ref={textareadRef}
                  required
                  name="text"
                  className="w-full text-gray-700"
                  placeholder="Write your entry..."
                ></textarea>
              </div>

              <div className="mt-1 text-right">
                <button
                  className="bg-blue-500 px-4 py-1 font-medium text-white"
                  type="submit"
                >
                  {fetcher.state === "submitting" ? "Saving..." : "Save"}
                </button>
              </div>
            </div>
          </fieldset>
        </fetcher.Form>
      </div>

      <div className="mt-6">
        <p className="font-bold">Week of February 20th</p>

        <div className="mt-3 space-y-4">
          <div>
            <p>Work</p>
            <ul className="ml-7 list-disc">
              <li>First item</li>
              <li>Second item</li>
            </ul>
          </div>
          <div>
            <p>Learnings</p>
            <ul className="ml-7 list-disc">
              <li>First item</li>
              <li>Second item</li>
            </ul>
          </div>
          <div>
            <p>Interesting things</p>
            <ul className="ml-7 list-disc">
              <li>First item</li>
              <li>Second item</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
