module Main exposing (main)

import Array
import Browser
import Html exposing (Html, div)
import RichText.Commands exposing (defaultCommandMap)
import RichText.Config.Decorations exposing (emptyDecorations)
import RichText.Config.ElementDefinition exposing (ElementDefinition, ElementToHtml, HtmlToElement, blockLeaf, elementDefinition, inlineLeaf)
import RichText.Definitions exposing (doc, image, markdown, paragraph)
import RichText.Editor exposing (Config, Editor, Message, config, init, update, view)
import RichText.Model.Attribute exposing (findStringAttribute)
import RichText.Model.Element as Element
import RichText.Model.HtmlNode exposing (HtmlNode(..))
import RichText.Model.Node
    exposing
        ( Block
        , block
        , blockChildren
        , inlineChildren
        , inlineElement
        , plainText
        )
import RichText.Model.State exposing (state)


main : Program () Model Msg
main =
    Browser.element { init = myInit, update = myUpdate, view = myView, subscriptions = subscriptions }



--Init


documentReference : ElementDefinition
documentReference =
    elementDefinition
        { name = "image"
        , group = "inline"
        , contentType = inlineLeaf
        , toHtmlNode = documentReferenceToHtmlNode
        , fromHtmlNode = htmlNodeToDocumentReference
        , selectable = True
        }


documentReferenceToHtmlNode : ElementToHtml
documentReferenceToHtmlNode parameters _ =
    let
        attr =
            filterAttributesToHtml
                [ ( "src", Just <| Maybe.withDefault "" (findStringAttribute "src" (Element.attributes parameters)) )
                , ( "alt", findStringAttribute "alt" (Element.attributes parameters) )
                , ( "title", findStringAttribute "title" (Element.attributes parameters) )
                ]
    in
    ElementNode "img"
        attr
        Array.empty


htmlNodeToDocumentReference : HtmlToElement
htmlNodeToDocumentReference def node =
    case node of
        ElementNode _ _ _ ->
            Just <| ( Element.element def [], Array.empty )

        _ ->
            Nothing


docNode : Block
docNode =
    block
        (Element.element doc [])
        (blockChildren <|
            Array.fromList
                [ block
                    (Element.element paragraph [])
                    (inlineChildren <| Array.fromList [ plainText "Hello world" ])
                , block
                    (Element.element paragraph [])
                    (inlineChildren <| Array.fromList [ inlineElement (Element.element documentReference []) [] ])
                ]
        )


myInit : () -> ( Model, Cmd Msg )
myInit _ =
    ( { editor = init <| state docNode Nothing }, Cmd.none )



-- Model


type alias Model =
    { editor : Editor
    }



-- Msg


type Msg
    = InternalMessage Message



--Subscriptions


subscriptions : Model -> Sub Msg
subscriptions _ =
    Sub.none



-- Update


myConfig : Config Msg
myConfig =
    config
        { decorations = emptyDecorations
        , commandMap = defaultCommandMap
        , spec = markdown
        , toMsg = InternalMessage
        }


myUpdate : Msg -> Model -> ( Model, Cmd Msg )
myUpdate msg model =
    case msg of
        InternalMessage internalEditorMsg ->
            ( { model | editor = update myConfig internalEditorMsg model.editor }, Cmd.none )



-- View


myView : Model -> Html Msg
myView model =
    div [] [ view myConfig model.editor ]
