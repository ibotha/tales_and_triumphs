module Main exposing (main)

import Array
import Browser
import Html exposing (Html, div, text)
import RichText.Commands exposing (defaultCommandMap)
import RichText.Config.Decorations exposing (emptyDecorations)
import RichText.Definitions exposing (doc, markdown, paragraph)
import RichText.Editor exposing (Config, Editor, Message, config, init, update, view)
import RichText.Model.Element as Element
import RichText.Model.Node
    exposing
        ( Block
        , Children(..)
        , Inline(..)
        , block
        , blockChildren
        , inlineChildren
        , plainText
        )
import RichText.Model.State exposing (state)


main : Program () Model Msg
main =
    Browser.element { init = myInit, update = myUpdate, view = myView, subscriptions = subscriptions }



--Init


docNode : Block
docNode =
    block
        (Element.element doc [])
        (blockChildren <|
            Array.fromList
                [ block
                    (Element.element paragraph [])
                    (inlineChildren <| Array.fromList [ plainText "Hello world" ])
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


myView : Model -> Html Msg
myView model =
    div [] [ view myConfig model.editor ]
