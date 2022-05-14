import { ContentBlock, ContentState } from "draft-js";

export const findNamedEntitiesFactory =
  (name: string) =>
  (
    contentBlock: ContentBlock,
    callback: (start: number, end: number) => void,
    contentState: ContentState
  ) => {
    contentBlock.findEntityRanges((character) => {
      const entityKey = character.getEntity();
      return (
        entityKey !== null &&
        contentState.getEntity(entityKey).getType() === name
      );
    }, callback);
  };

export const findRegexEntitiesFactory =
  (regex: RegExp) =>
  (
    contentBlock: ContentBlock,
    callback: (start: number, end: number) => void,
    contentState: ContentState
  ) => {
    const text = contentBlock.getText();
    const matchArr = text.matchAll(regex);
    let e: IteratorResult<RegExpMatchArray, any> | undefined;
    e = matchArr.next();
    while (e && e.value) {
      callback(e.value.index, e.value.index + e.value[0].length);
      e = matchArr.next();
    }
  };
