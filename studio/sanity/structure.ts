import { StructureBuilder } from "sanity/desk";

export const structure = (S: StructureBuilder) =>
  S.list()
    .title("Conteúdo")
    .items([
      S.documentTypeListItem("imovel").title("Imóveis"),
      // você pode adicionar mais aqui depois
    ]);
