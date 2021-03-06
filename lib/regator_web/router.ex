defmodule RegatorWeb.Router do
  use RegatorWeb, :router

  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :fetch_flash
    plug :protect_from_forgery
    plug :put_secure_browser_headers
  end

  pipeline :api do
    plug :accepts, ["json", "html"]
  end

  scope "/", RegatorWeb do
    pipe_through :browser

    get "/", PageController, :index
    get "/app/*path", AppController, :index
  end

  scope "/api", RegatorWeb do
    pipe_through :api

    scope "/service-worker" do
      get "/version", ServiceWorkerController, :version
    end
  end

  # Enables LiveDashboard only for development
  #
  # If you want to use the LiveDashboard in production, you should put
  # it behind authentication and allow only admins to access it.
  # If your application does not have an admins-only section yet,
  # you can use Plug.BasicAuth to set up some basic authentication
  # as long as you are also using SSL (which you should anyway).
  if Mix.env() in [:dev, :test] do
    import Phoenix.LiveDashboard.Router

    scope "/" do
      pipe_through :browser
      live_dashboard "/dashboard", metrics: RegatorWeb.Telemetry
    end
  end
end
