module Main exposing (main)

import Array
import Browser
import Html exposing (Html, div)
import RichText.Commands exposing (defaultCommandMap)
import RichText.Config.Decorations exposing (emptyDecorations)
import RichText.Config.ElementDefinition exposing (ElementDefinition, ElementToHtml, HtmlToElement, blockLeaf, defaultElementToHtml, elementDefinition, inlineLeaf)
import RichText.Config.Spec exposing (emptySpec, withElementDefinitions)
import RichText.Definitions exposing (doc, image, link, markdown, paragraph)
import RichText.Editor exposing (Config, Editor, Message, config, init, update, view)
import RichText.Model.Attribute exposing (Attribute(..), findStringAttribute)
import RichText.Model.Element as Element
import RichText.Model.HtmlNode exposing (HtmlNode(..))
import RichText.Model.Node
    exposing
        ( Block
        , Inline(..)
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
        { name = "doc-ref"
        , group = "inline"
        , contentType = inlineLeaf
        , toHtmlNode = documentReferenceToHtmlNode
        , fromHtmlNode = htmlNodeToDocumentReference
        , selectable = False
        }


documentReferenceToHtmlNode : ElementToHtml
documentReferenceToHtmlNode parameters children =
    ElementNode "a" [ ( "href", "/ho" ) ] <| Array.fromList [ TextNode "Hello" ]


htmlNodeToDocumentReference : HtmlToElement
htmlNodeToDocumentReference def node =
    case node of
        ElementNode _ _ children ->
            Just <| ( Element.element def [], children )

        _ ->
            Nothing


docRef : String -> Inline
docRef s =
    inlineElement (Element.element documentReference []) []


docNode : Block
docNode =
    block
        (Element.element doc [])
        (blockChildren <|
            Array.fromList
                [ block
                    (Element.element paragraph [])
                    (inlineChildren <| Array.fromList [ plainText "Hello world", docRef "123456" ])
                , block
                    (Element.element paragraph [])
                    (inlineChildren <|
                        Array.fromList
                            [ docRef "123456"
                            ]
                    )
                , block
                    (Element.element paragraph [])
                    (inlineChildren <| Array.fromList [ plainText "Hello world", docRef "123456", plainText "Hello world" ])
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
        , spec =
            markdown
                |> withElementDefinitions
                    [ documentReference
                    ]
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
