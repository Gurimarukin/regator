defmodule RegatorWeb.PageController do
  use RegatorWeb, :controller

  def index(conn, _params) do
    conn
    # |> assign(:card_data, Heros.Game.Cards.Card.data())
    # |> assign(:csrf_token, get_csrf_token())
    |> render("index.html")
  end
end
