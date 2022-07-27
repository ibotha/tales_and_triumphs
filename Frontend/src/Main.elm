module Main exposing (main)

import Browser
import Html exposing (Html, div, h1, h2, h3, h4, h5, h6, li, ol, text, ul)
import Html.Attributes exposing (class, contenteditable)
import Html.Events exposing (preventDefaultOn)
import Json.Decode as Decode
import Keyboard.Event exposing (KeyboardEvent, decodeKeyboardEvent)


main : Program () Model Msg
main =
    Browser.element { init = init, update = update, view = view, subscriptions = subscriptions }



--Init


init : () -> ( Model, Cmd Msg )
init _ =
    ( [ Header "Jensin" 1, Text "Jensin is a boi that can do things.", List Unordered [ "The", "Cow", "Jumped", "Over" ] ], Cmd.none )



-- Model


type ListType
    = Unordered
    | Ordered


type ContentBlock
    = Header String Int
    | Text String
    | List ListType (List String)


type alias Model =
    List ContentBlock



-- Msg


type Msg
    = HandleKeyboardEvent KeyboardEvent
    | InsertNewBlock
    | NoOp



--Subscriptions


subscriptions : Model -> Sub Msg
subscriptions _ =
    Sub.none



-- Update


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        HandleKeyboardEvent e ->
            Debug.log (Debug.toString e)
                ( model, Cmd.none )

        InsertNewBlock ->
            ( List.append model [ Text "New" ], Cmd.none )

        NoOp ->
            ( model, Cmd.none )


listElementView : String -> Html Msg
listElementView str =
    li [] [ text str ]


blockView : ContentBlock -> Html Msg
blockView block =
    case block of
        Header content level ->
            (case level of
                1 ->
                    h1

                2 ->
                    h2

                3 ->
                    h3

                4 ->
                    h4

                5 ->
                    h5

                6 ->
                    h6

                _ ->
                    h1
            )
                [ contenteditable True, class "editor-block" ]
                [ text content ]

        Text content ->
            div [ contenteditable True, class "editor-block" ] [ text content ]

        List ltype content ->
            (case ltype of
                Ordered ->
                    ol

                Unordered ->
                    ul
            )
                [ contenteditable True, class "editor-block" ]
                (List.map listElementView content)


mapEditorEvent : KeyboardEvent -> ( Msg, Bool )
mapEditorEvent rawEvent =
    case rawEvent.key of
        Just key ->
            case key of
                "Enter" ->
                    if rawEvent.shiftKey then
                        ( NoOp, False )

                    else
                        ( InsertNewBlock, True )

                _ ->
                    ( NoOp, False )

        _ ->
            ( NoOp, False )


editor : Model -> Html Msg
editor model =
    div
        [ class "editor"
        , preventDefaultOn "keydown" <|
            Decode.map mapEditorEvent decodeKeyboardEvent
        ]
        [ div [] (List.map blockView model)
        ]


view : Model -> Html Msg
view model =
    editor model
