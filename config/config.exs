# This file is responsible for configuring your application
# and its dependencies with the aid of the Mix.Config module.
#
# This configuration file is loaded before any dependency and
# is restricted to this project.

# General application configuration
use Mix.Config

config :regator,
  ecto_repos: [Regator.Repo]

# Configures the endpoint
config :regator, RegatorWeb.Endpoint,
  url: [host: "localhost"],
  secret_key_base: "Xe1NNA+C8zYZoIsquy6VsDuwKJIB5nwygQfD8pw5oouIpX49a3dLJISLnNL17sGv",
  render_errors: [view: RegatorWeb.ErrorView, accepts: ~w(html json), layout: false],
  pubsub_server: Regator.PubSub,
  live_view: [signing_salt: "YAFZALP4"]

# Configures Elixir's Logger
config :logger, :console,
  format: "$time $metadata[$level] $message\n",
  metadata: [:request_id]

# Use Jason for JSON parsing in Phoenix
config :phoenix, :json_library, Jason

# Import environment specific config. This must remain at the bottom
# of this file so it overrides the configuration defined above.
import_config "#{Mix.env()}.exs"
