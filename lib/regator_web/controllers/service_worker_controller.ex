defmodule RegatorWeb.ServiceWorkerController do
  use RegatorWeb, :controller

  @version "0.1.0"

  def version(conn, _params) do
    version =
      if Mix.env() == :dev do
        "v#{:os.system_time(:millisecond)}"
      else
        @version
      end

    send_resp(conn, 200, version)
  end
end
