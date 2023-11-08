import { Fragment, useEffect, useState } from "react";
import { Dialog, Tab, Transition } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import {
  PostResource,
  Resource,
  ResourceDetail,
  Skill,
  fetchResource,
  fetchResourceSkills,
  fetchResources,
  fetchSkills,
  saveResource,
} from "./fetchApi";
import { Field, Form, Formik } from "formik";
import * as Yup from "yup";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function Example() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showNewResourceForm, setShowNewResourceForm] = useState(false);
  const [resources, setResources] = useState<Resource[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);

  const [selectedResourceId, setSelectedResourceId] = useState<string>("");
  const [selectedResource, setSelectedResource] = useState<ResourceDetail>();
  const [resourceSkills, setResourceSkills] = useState<Skill[]>([]);
  const [selectedButton, setSelectedButton] = useState("descending");

  const Title = () => (
    <>
      <span className="inline-flex items-center rounded-md bg-violet-600 px-2.5 py-2 mr-2 text-lg text-white">
        vf
      </span>
      resourcing
    </>
  );

  const Button = () => (
    <button
      type="button"
      onClick={() => {
        setSelectedResourceId("");
        setShowNewResourceForm(true);
      }}
      className="ml-1 inline-flex items-center rounded-md bg-violet-600 px-4 py-1 text-md font-light text-white shadow-sm hover:bg-violet-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600"
    >
      + New Resource
    </button>
  );

  const Nav = () => {
    return (
      <nav className="flex flex-1 flex-col">
        <ul role="list" className="flex flex-1 flex-col">
          {/* Sort */}
          <ul role="list" className="py-3 border-t border-b border-gray-200">
            <div className="flex justify-between items-center mx-3">
              <span className="text-sm">Sort</span>
              <div>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedButton("descending");
                    setResources(
                      resources.sort((a, b) => (a.name > b.name ? 1 : -1))
                    );
                  }}
                  className={
                    selectedButton === "descending"
                      ? "rounded-md bg-violet-100 px-2 py-1 text-sm text-violet-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600"
                      : "rounded-md px-2 py-1 text-sm text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600"
                  }
                >
                  A-Z
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedButton("ascending");
                    setResources(
                      resources.sort((a, b) => (b.name > a.name ? 1 : -1))
                    );
                  }}
                  className={
                    selectedButton === "ascending"
                      ? "rounded-md bg-violet-100 px-2 py-1 text-sm text-violet-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600"
                      : "rounded-md px-2 py-1 text-sm text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600"
                  }
                >
                  Z-A
                </button>
              </div>
            </div>
          </ul>

          {/* Resources List */}
          <ul role="list" className="mx-2 mt-4">
            {resources &&
              resources.map((resource) => (
                <li key={resource.id}>
                  <span
                    onClick={() => setSelectedResourceId(resource.id)}
                    className={classNames(
                      resource.id === selectedResourceId
                        ? "bg-violet-100 border border-violet-200"
                        : "",
                      "text-gray-900 group flex gap-x-3 rounded-md p-1 text-sm leading-6"
                    )}
                  >
                    <span className="text-base truncate cursor-pointer">
                      {resource.name}
                    </span>
                  </span>
                </li>
              ))}
          </ul>

          {/* New Resource Button */}
          <li className="-ml-4 mt-auto">
            <div className="flex items-center gap-x-4 px-6 py-3 text-sm font-semibold leading-6 text-gray-900">
              <Button />
            </div>
          </li>
        </ul>
      </nav>
    );
  };

  // Fetch data from API and set in useState variables
  const fetchData = async () => {
    const resources = await fetchResources();
    const skills = await fetchSkills();

    // Appropriately sort the data
    setResources(resources.sort((a, b) => (a.name > b.name ? 1 : -1)));
    setSkills(skills.sort((a, b) => (a.id > b.id ? 1 : -1)));
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Fetch selected Resource + Skills when resource name is selected
  useEffect(() => {
    const fetchData = async (resourceId: string) => {
      const resource = await fetchResource(resourceId);
      if (resource) {
        setSelectedResource(resource);
        const resourceSkills = await fetchResourceSkills(resourceId);
        setResourceSkills(resourceSkills);
      }
    };

    // Only re-query if the selectedResourceId has actually changed,
    // If the selectedResourceId is empty, clear loaded data
    if (selectedResourceId && selectedResourceId !== selectedResource?.id) {
      setLoading(true);
      setShowNewResourceForm(false);
      setSelectedResource(undefined);
      setResourceSkills([]);
      fetchData(selectedResourceId).then(() => setLoading(false));
    } else if (!selectedResourceId) {
      setSelectedResource(undefined);
      setResourceSkills([]);
    }
  }, [selectedResource?.id, selectedResourceId]);

  // Utility method to get the first letter of each word in a string,
  // e.g. Initials from a name
  const getInitials = (name: string) => {
    const intitials = name
      .split(/\s/)
      .reduce((response, word) => (response += word.slice(0, 1)), "");
    return intitials;
  };

  // Used by Formik to validate the shape and state of the form data
  const resourceValidationSchema = Yup.object().shape({
    firstname: Yup.string()
      .min(2, "Too Short!")
      .max(50, "Too Long!")
      .required("First Name is required"),
    lastname: Yup.string()
      .min(2, "Too Short!")
      .max(50, "Too Long!")
      .required("Last Name is required"),
    role: Yup.string()
      .min(2, "Too Short!")
      .max(50, "Too Long!")
      .required("Role is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    skills: Yup.array()
      .of(Yup.string())
      .min(1, "At least one skill is required")
      .required("At least one skill is required"),
  });

  // Form submit method, saves form data as a new resource
  const handleSubmit = async (values: PostResource) => {
    const postObj: PostResource = {
      firstname: values.firstname,
      lastname: values.lastname,
      role: values.role,
      email: values.email,
      skills: [...values.skills.map((skill) => Number(skill))],
    };

    const response = await saveResource(postObj);

    // If save was successful, notify user, refresh data and select the new resource for detail view
    if (response.id) {
      alert("New resource saved.");
      await fetchData();
      setSelectedResourceId(response.id);
    }
  };

  return (
    <>
      {/* Popup/dialog sidebar for mobile */}
      <Transition.Root show={sidebarOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50 lg:hidden"
          onClose={setSidebarOpen}
        >
          {/* Overlay to darken background when sidebar is open */}
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-900/80" />
          </Transition.Child>

          <div className="fixed inset-0 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                <Transition.Child
                  as={Fragment}
                  enter="ease-in-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in-out duration-300"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                    <button
                      type="button"
                      className="-m-2.5 p-2.5"
                      onClick={() => setSidebarOpen(false)}
                    >
                      <span className="sr-only">Close sidebar</span>
                      <XMarkIcon
                        className="h-6 w-6 text-white"
                        aria-hidden="true"
                      />
                    </button>
                  </div>
                </Transition.Child>

                {/* Sidebar */}
                <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-2">
                  <div className="flex h-16 shrink-0 items-center uppercase">
                    <Title />
                  </div>
                  <Nav />
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      {/* Static sidebar for desktop */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        {/* Sidebar */}
        <div className="flex grow flex-col overflow-y-auto bg-gray-50 px-3">
          <div className="flex my-6 items-center uppercase">
            <Title />
          </div>
          <Nav />
        </div>
      </div>

      {/* Main header bar for mobile */}
      <div className="sticky top-0 z-40 flex items-center gap-x-6 bg-white px-4 py-4 shadow-sm sm:px-6 lg:hidden">
        {/* Open Sidebar button - only visible on mobile */}
        <button
          type="button"
          className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
          onClick={() => setSidebarOpen(true)}
        >
          <span className="sr-only">Open sidebar</span>
          <Bars3Icon className="h-6 w-6" aria-hidden="true" />
        </button>

        <div className="flex-1 text-lg font-medium leading-6 text-gray-900 uppercase">
          <Title />
        </div>
        {/* <Button /> */}
      </div>

      {/* Main content e.g. resource form */}
      <main className="py-8 lg:pl-72">
        <div className="px-4 sm:px-6 lg:px-8">
          {/* If loading, show loading message */}
          {/* If not, show selectedResouce and resourceSkills data (if any) */}
          {loading ? (
            <div className="m-2">
              <span>Loading...</span>
            </div>
          ) : (
            selectedResource && (
              <>
                <span>
                  <span className="rounded-full bg-gray-200 p-3.5 mr-3 text-md text-gray-900">
                    {getInitials(selectedResource.name)}
                  </span>
                  {selectedResource.name}
                </span>

                <Tab.Group>
                  <Tab.List>
                    <div className="ml-16 mt-12">
                      <Tab>
                        {({ selected }) => (
                          <div
                            className={
                              selected
                                ? "rounded-md bg-violet-100 px-2 py-1 text-sm text-violet-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600"
                                : "rounded-md px-2 py-1 text-sm text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600"
                            }
                          >
                            Overview
                          </div>
                        )}
                      </Tab>
                      <Tab>
                        {({ selected }) => (
                          <div
                            className={classNames(
                              selected
                                ? "rounded-md bg-violet-100 px-2 py-1 text-sm text-violet-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600"
                                : "rounded-md px-2 py-1 text-sm text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600"
                            )}
                          >
                            Skills
                          </div>
                        )}
                      </Tab>
                    </div>
                  </Tab.List>

                  <Tab.Panels>
                    <Tab.Panel>
                      <div className="ml-16 mt-8">
                        <div className="mt-2">
                          <span className="text-sm font-light text-gray-600">
                            Role
                          </span>
                          <p className="text-md text-gray-800">
                            {selectedResource.role}
                          </p>
                        </div>

                        <div className="mt-2">
                          <span className="text-sm font-light text-gray-600">
                            Email
                          </span>
                          <p className="text-md text-gray-800">
                            {selectedResource.email}
                          </p>
                        </div>
                      </div>
                    </Tab.Panel>
                    <Tab.Panel>
                      <div className="ml-20 mt-8">
                        <div className="mt-2">
                          <div className="text-md text-gray-800">
                            {resourceSkills && (
                              <ul className="list-disc">
                                {resourceSkills.map((skill) => (
                                  <li key={skill.id} className="px-2">
                                    {skill.name}
                                  </li>
                                ))}
                              </ul>
                            )}
                            {!resourceSkills.length && (
                              <span>No Skills to display.</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </Tab.Panel>
                  </Tab.Panels>
                </Tab.Group>
              </>
            )
          )}

          {/* Show new Resource form if new resource button is selected */}
          {showNewResourceForm && (
            <>
              <span>Create New Resource</span>

              <div className="mt-4">
                <Formik
                  initialValues={{
                    firstname: "",
                    lastname: "",
                    email: "",
                    role: "",
                    skills: [],
                  }}
                  validationSchema={resourceValidationSchema}
                  onSubmit={(values, form) =>
                    handleSubmit(values).then(() => form.resetForm())
                  }
                >
                  {({ errors, touched, dirty, isValid, isSubmitting }) => (
                    <Form>
                      <div className="grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-8">
                        <div className="xl:col-span-2 lg:col-span-3 sm:col-span-4">
                          <label
                            htmlFor="firstname"
                            className="text-sm font-light text-gray-600"
                          >
                            First Name
                          </label>
                          <div>
                            <Field
                              name="firstname"
                              id="firstname"
                              className="block w-full border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                          </div>
                          {errors.firstname && touched.firstname ? (
                            <div className="mt-1 text-red-500">
                              {errors.firstname}
                            </div>
                          ) : null}
                        </div>

                        <div className="xl:col-span-2 lg:col-span-3 sm:col-span-4">
                          <label
                            htmlFor="lastname"
                            className="text-sm font-light text-gray-600"
                          >
                            Last Name
                          </label>
                          <div>
                            <Field
                              name="lastname"
                              id="lastname"
                              className="block w-full border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                          </div>
                          {errors.lastname && touched.lastname ? (
                            <div className="mt-1 text-red-500">
                              {errors.lastname}
                            </div>
                          ) : null}
                        </div>
                      </div>

                      <div className="mt-2 grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-8">
                        <div className="xl:col-span-2 lg:col-span-3 sm:col-span-4">
                          <label
                            htmlFor="role"
                            className="text-sm font-light text-gray-600"
                          >
                            Role
                          </label>
                          <div>
                            <Field
                              name="role"
                              id="role"
                              className="block w-full border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                          </div>
                          {errors.role && touched.role ? (
                            <div className="mt-1 text-red-500">
                              {errors.role}
                            </div>
                          ) : null}
                        </div>
                      </div>

                      <div className="mt-2 grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-8">
                        <div className="xl:col-span-2 lg:col-span-3 sm:col-span-4">
                          <label
                            htmlFor="email"
                            className="text-sm font-light text-gray-600"
                          >
                            Email
                          </label>
                          <div>
                            <Field
                              type="email"
                              name="email"
                              id="email"
                              className="block w-full border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                          </div>
                          {errors.email && touched.email ? (
                            <div className="mt-1 text-red-500">
                              {errors.email}
                            </div>
                          ) : null}
                        </div>
                      </div>

                      <div className="mt-4 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-8">
                        <div className="xl:col-span-2 lg:col-span-3 sm:col-span-4">
                          <label
                            htmlFor="skills"
                            className="text-sm font-light text-gray-600"
                          >
                            Skills
                          </label>

                          <div className="mt-2">
                            {skills &&
                              skills.map((skill) => (
                                <label
                                  key={skill.name}
                                  className="mt-2 flex items-center gap-x-4"
                                >
                                  <Field
                                    type="checkbox"
                                    name="skills"
                                    className="rounded-sm border-gray-400"
                                    value={skill.id.toString()}
                                  />
                                  {skill.name}
                                </label>
                              ))}
                          </div>
                          {errors.skills && touched.skills ? (
                            <div className="mt-1 text-red-500">
                              {errors.skills}
                            </div>
                          ) : null}
                        </div>
                      </div>

                      <div className="mt-10 flex items-center justify-start gap-x-6">
                        <button
                          type="submit"
                          disabled={!isValid || !dirty || isSubmitting}
                          className={
                            isValid && dirty && !isSubmitting
                              ? "rounded-md bg-violet-100 border border-violet-200 px-8 py-1.5 text-sm text-gray-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600"
                              : "rounded-md bg-violet-50 border border-violet-100 px-8 py-1.5 text-sm text-gray-400"
                          }
                        >
                          Save
                        </button>
                      </div>
                    </Form>
                  )}
                </Formik>
              </div>
            </>
          )}
        </div>
      </main>
    </>
  );
}
