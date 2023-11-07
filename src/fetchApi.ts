export interface Skill {
  id: number;
  name: string;
}

export interface Resource {
  id: string;
  name: string;
}

export interface ResourceDetail extends Resource {
  role: string;
  email: string;
}

export interface PostResource {
  firstname: string;
  lastname: string;
  role: string;
  email: string;
  skills: Skill[];
}

export const fetchResources = () => {
  return fetch("http://localhost:4000/resources/")
    .then((response) => response.json())
    .then((data: Resource[]) => data)
    .catch((error) => {
      if (error) {
        console.error(error);
      }
      return [];
    });
};

export const fetchResource = (id: string) => {
  return fetch(`http://localhost:4000/resources/${id}/`)
    .then((response) => response.json())
    .then((data: ResourceDetail) => data)
    .catch((error) => {
      if (error) {
        console.error(error);
      }
      return null;
    });
};

export const fetchResourceSkills = (id: string) => {
  return fetch(`http://localhost:4000/resources/${id}/skills/`)
    .then((response) => response.json())
    .then((data: Skill[]) => data)
    .catch((error) => {
      if (error) {
        console.error(error);
      }
      return [];
    });
};

export const saveResource = (resource: PostResource) => {
  return fetch(`http://localhost:4000/resources/`, {
    method: "POST",
    body: JSON.stringify(resource),
  })
    .then((response) => response.json())
    .then((data: string) => data)
    .catch((error) => {
      if (error) {
        console.error(error);
      }
      return "";
    });
};

export const fetchSkills = () => {
  return fetch(`http://localhost:4000/skills/`)
    .then((response) => response.json())
    .then((data: Skill[]) => data)
    .catch((error) => {
      if (error) {
        console.error(error);
      }
      return [];
    });
};
