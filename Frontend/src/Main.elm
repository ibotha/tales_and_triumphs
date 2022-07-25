port module Main exposing (main, upEditor)

-- import Element exposing (centerX, centerY, column, el, fillPortion, height, html, layout, padding, px, rgb255, spacing, text, width)
-- import Element.Background as Background
-- import Element.Font as Font
-- import Element.Input exposing (button)

import Browser
import Browser.Dom as Dom
import Html exposing (Html, button, div, text)
import Html.Attributes exposing (id)
import Html.Events exposing (onClick)
import Task


main : Program () Model Msg
main =
    Browser.element { init = init, update = update, view = view, subscriptions = subscriptions }



--Init


init : () -> ( Model, Cmd Msg )
init flags =
    ( False, Dom.getElement "Editor" |> Task.attempt LoadEditor )



-- Model


type alias Model =
    Bool



-- Ports


port upEditor : Bool -> Cmd msg



-- Msg


type Msg
    = ChangeEdit
    | LoadEditor (Result Dom.Error Dom.Element)



--Subscriptions


subscriptions : Model -> Sub Msg
subscriptions model =
    Sub.none



-- Update


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        ChangeEdit ->
            ( not model, Dom.getElement "Editor" |> Task.attempt LoadEditor )

        LoadEditor res ->
            ( model
            , case res of
                Ok _ ->
                    upEditor True

                Err _ ->
                    upEditor False
            )


view : Model -> Html Msg
view model =
    div []
        [ button [ onClick ChangeEdit ]
            [ text "Switch" ]
        , div
            []
            [ if model then
                text "Hello"

              else
                div [ id "Editor" ] []
            ]
        ]



-- layout [ Background.color (rgb255 33 33 33), Font.color (rgb255 210 210 210) ]
--     (column
--         [ spacing 36
--         , centerX
--         , centerY
--         , padding 50
--         ]
--         [ button [ Background.color (rgb255 20 125 120), padding 5, centerX ] { onPress = Just ChangeEdit, label = text "Hello" }
--         , if model then
--             text "Hello"
--           else
--             html ()
--         ]
--     )
