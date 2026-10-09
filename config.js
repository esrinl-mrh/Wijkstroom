export const CONFIG = Object.freeze({
  sdkVersion: "5.1",
  portalUrl: "https://www.arcgis.com",
  appId: "XuY49z40Hvdfyr3g",
  expectedOrgId: "6z4uZ7kWPxzgLixu",
  authNamespace: "/wijkstroom-router",
  admin: Object.freeze({
    username: "admin.wijkstroom",
    destination: "https://wijkstroom.maps.arcgis.com/home/content.html"
  }),
  groupRoutes: Object.freeze({
    "25702cd09f0d4008b493b454fb639ff7": Object.freeze({ name: "BAM", destination: "https://experience.arcgis.com/experience/b6740c05d6f04525baa7b692ec8edab9/" }),
    "4eb118d8a5ec4684a55905eba338ab53": Object.freeze({ name: "Hanab", destination: "https://experience.arcgis.com/experience/b6740c05d6f04525baa7b692ec8edab9/" }),
    "933357c2b6fc419dbfe5b5873f017e1b": Object.freeze({ name: "Siers", destination: "https://experience.arcgis.com/experience/b6740c05d6f04525baa7b692ec8edab9/" }),
    "1885a8866b394baba80e817a2a171983": Object.freeze({ name: "Van Gelder", destination: "https://experience.arcgis.com/experience/b6740c05d6f04525baa7b692ec8edab9/" }),
    "452c470ee5d243bdb4bcaa68e1e822e4": Object.freeze({ name: "Hak", destination: "https://experience.arcgis.com/experience/b6740c05d6f04525baa7b692ec8edab9/" }),
    "45a915eb2d0040f48b7dc247cd4a310f": Object.freeze({ name: "Alsema", destination: "https://experience.arcgis.com/experience/b6740c05d6f04525baa7b692ec8edab9/" }),
    "61278bad5fb34a72bbd6cf084c71e4d7": Object.freeze({ name: "Baas Verkley", destination: "https://experience.arcgis.com/experience/b6740c05d6f04525baa7b692ec8edab9/" })
  }),
  noAccessUrl: new URL("./no-access.html", window.location.href).href,
  configurationErrorUrl: new URL("./configuration-error.html", window.location.href).href
});
