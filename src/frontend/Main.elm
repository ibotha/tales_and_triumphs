module Main exposing (..)

import Browser
import Browser.Navigation as Nav
import Html exposing (..)
import Html.Attributes exposing (contenteditable, href, src)
import Html.Events exposing (on, onInput)
import Json.Decode as JD
import Json.Encode as JE
import Url



-- MAIN


main : Program () Model Msg
main =
    Browser.application
        { init = init
        , update = update
        , subscriptions = subscriptions
        , view = view
        , onUrlChange = UrlChanged
        , onUrlRequest = LinkClicked
        }



-- MODEL


type alias Model =
    { key : Nav.Key, url : Url.Url }


init : () -> Url.Url -> Nav.Key -> ( Model, Cmd msg )
init _ url key =
    ( { url = url, key = key }
    , Cmd.none
    )



-- UPDATE


type Msg
    = LinkClicked Browser.UrlRequest
    | UrlChanged Url.Url
    | EditorChanged String


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        LinkClicked urlRequest ->
            case urlRequest of
                Browser.Internal url ->
                    ( model, Nav.pushUrl model.key (Url.toString url) )

                Browser.External href ->
                    ( model, Nav.load href )

        UrlChanged _ ->
            ( model
            , Cmd.none
            )

        EditorChanged string ->
            ( model, Cmd.none )



-- SUBSCRIPTIONS


subscriptions : Model -> Sub Msg
subscriptions _ =
    Sub.none



-- VIEW


viewLink : String -> Html msg
viewLink path =
    li [] [ a [ href path ] [ text path ] ]


onContent tagger =
    on "input" (JD.map tagger targetInnerHtml)


targetInnerHtml =
    JD.at [ "target", "innerHTML" ] JD.string


view : Model -> Browser.Document Msg
view model =
    { title = "T&T"
    , body =
        [ h1 [] [ text "Editor" ]
        , div [ contenteditable True, onContent EditorChanged ]
            []
        ]
    }
